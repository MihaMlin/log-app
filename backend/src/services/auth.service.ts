import { Env } from "../config/env.config";
import { HTTPSTATUS } from "../constants/http";
import { VerificationCodeType } from "../constants/verificationCodeType";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import appAssert from "../utils/appAssert";
import { hashValue } from "../utils/bcrypt";
import {
  ONE_DAY_MS,
  fiveMinutesAgo,
  oneDayFromNow,
  oneHourFromNow,
  thirtyDaysFromNow,
} from "../utils/date";
import {
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from "../utils/jwt";
import { sendMail } from "../mailers/sendMail";
import { getPasswordResetTemplate } from "../mailers/templates/passwordReset.template";
import { getPasswordInitialSetTemplate } from "../mailers/templates/passwordInitialSet.template";

type CreateAccountParams = {
  email: string;
  role: "user" | "admin";
};
export const createAccount = async ({ email, role }: CreateAccountParams) => {
  // verify email is not taken
  const existingUser = await UserModel.exists({ email });

  appAssert(!existingUser, HTTPSTATUS.CONFLICT, "Email already in use");

  const user = await UserModel.create({ email, role });

  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.PasswordInitialSet,
    expiresAt: oneDayFromNow(),
  });

  const url = `${Env.APP_ORIGIN}/password/set/${verificationCode.id}`;

  // send verification email
  const { error } = await sendMail({
    to: user.email,
    ...getPasswordInitialSetTemplate(url),
  });

  // ignore email errors for now
  if (error) console.error(error);

  return {
    user: user.omitPassword(),
  };
};

type LoginParams = {
  email: string;
  password: string;
  userAgent?: string;
};
export const loginUser = async ({
  email,
  password,
  userAgent,
}: LoginParams) => {
  const user = await UserModel.findOne({ email });
  appAssert(user, HTTPSTATUS.UNAUTHORIZED, "Invalid email or password");

  const isValid = await user.comparePassword(password);
  appAssert(isValid, HTTPSTATUS.UNAUTHORIZED, "Invalid email or password");

  const session = await SessionModel.create({
    userId: user._id,
    userAgent,
  });

  const sessionInfo: RefreshTokenPayload = {
    sessionId: session._id,
  };

  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);
  const accessToken = signToken({
    ...sessionInfo,
    userId: user._id,
    role: user.role,
  });

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

type SetInitialPasswordParams = {
  password: string;
  userAgent?: string;
  code: string;
};
export const setInitialPassword = async ({
  password,
  userAgent,
  code,
}: SetInitialPasswordParams) => {
  // confirm the verification code is valid
  const validCode = await VerificationCodeModel.findOne({
    _id: code,
    type: VerificationCodeType.PasswordInitialSet,
    expiresAt: { $gt: new Date() },
  });
  appAssert(
    validCode,
    HTTPSTATUS.NOT_FOUND,
    "Invalid or expired verification code"
  );
  // update user with new password
  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    {
      password: await hashValue(password),
      verified: true,
    },
    { new: true }
  );
  appAssert(
    updatedUser,
    HTTPSTATUS.INTERNAL_SERVER_ERROR,
    "Failed to verify email"
  );

  // delete the verification code
  await validCode.deleteOne();

  // create session
  const session = await SessionModel.create({
    userId: updatedUser._id,
    userAgent,
  });

  // create JWT tokens
  const sessionInfo: RefreshTokenPayload = {
    sessionId: session._id,
  };

  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);
  const accessToken = signToken({
    ...sessionInfo,
    userId: updatedUser._id,
    role: updatedUser.role,
  });

  return {
    user: updatedUser.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });
  appAssert(payload, HTTPSTATUS.UNAUTHORIZED, "Invalid refresh token");

  const session = await SessionModel.findById(payload.sessionId);
  const now = Date.now();
  appAssert(
    session && session.expiresAt.getTime() > now,
    HTTPSTATUS.UNAUTHORIZED,
    "Session expired"
  );

  const user = await UserModel.findById(session.userId);
  appAssert(user, HTTPSTATUS.UNAUTHORIZED, "User not found for session");

  // refresh the session if it expires in the next 24hrs
  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;
  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  // generate JWT token(s)
  const sessionInfo: RefreshTokenPayload = {
    sessionId: session._id,
  };

  const newRefreshToken = sessionNeedsRefresh
    ? signToken(sessionInfo, refreshTokenSignOptions)
    : undefined;

  const accessToken = signToken({
    ...sessionInfo,
    userId: session.userId,
    role: user.role,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};

export const sendPasswordResetEmail = async (email: string) => {
  // Catch any errors that were thrown and log them (but always return a success)
  // This will prevent leaking sensitive data back to the client (e.g. user not found, email not sent).
  try {
    const user = await UserModel.findOne({ email });
    appAssert(user, HTTPSTATUS.NOT_FOUND, "User not found");

    // check for max password reset requests (2 emails in 5min)
    const fiveMinAgo = fiveMinutesAgo();
    const count = await VerificationCodeModel.countDocuments({
      userId: user._id,
      type: VerificationCodeType.PasswordReset,
      createdAt: { $gt: fiveMinAgo },
    });
    appAssert(
      count <= 1,
      HTTPSTATUS.TOO_MANY_REQUESTS,
      "Too many requests, please try again later"
    );

    const expiresAt = oneHourFromNow();
    const verificationCode = await VerificationCodeModel.create({
      userId: user._id,
      type: VerificationCodeType.PasswordReset,
      expiresAt,
    });

    const url = `${Env.APP_ORIGIN}/password/reset?code=${
      verificationCode._id
    }&exp=${expiresAt.getTime()}`;

    const { data, error } = await sendMail({
      to: email,
      ...getPasswordResetTemplate(url),
    });

    appAssert(
      data?.id,
      HTTPSTATUS.INTERNAL_SERVER_ERROR,
      `${error?.name} - ${error?.message}`
    );

    return {
      url,
      emailId: data.id,
    };
  } catch (error: any) {
    console.log("SendPasswordResetError:", error.message);
    return {};
  }
};

type ResetPasswordParams = {
  password: string;
  verificationCode: string;
};
export const resetPassword = async ({
  verificationCode,
  password,
}: ResetPasswordParams) => {
  const validCode = await VerificationCodeModel.findOne({
    _id: verificationCode,
    type: VerificationCodeType.PasswordReset,
    expiresAt: { $gt: new Date() },
  });
  appAssert(
    validCode,
    HTTPSTATUS.NOT_FOUND,
    "Invalid or expired verification code"
  );

  const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
    password: await hashValue(password), // the mongoose hook `pre("save")` only runs on save, hash here is mandatory
  });
  appAssert(
    updatedUser,
    HTTPSTATUS.INTERNAL_SERVER_ERROR,
    "Failed to reset password"
  );

  await validCode.deleteOne();

  // delete all sessions for user
  await SessionModel.deleteMany({ userId: validCode.userId });

  return { user: updatedUser.omitPassword() };
};
