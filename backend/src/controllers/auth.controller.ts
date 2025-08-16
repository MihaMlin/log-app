import { HTTPSTATUS } from "../constants/http";
import SessionModel from "../models/session.model";
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
  resetPassword,
  sendPasswordResetEmail,
  setInitialPassword,
} from "../services/auth.service";
import appAssert from "../utils/appAssert";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "../utils/cookies";
import { verifyToken } from "../utils/jwt";
import asyncHandler from "../middleware/asyncHandler";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  setInitialPasswordSchema,
} from "../validators/auth.validator";

export const registerHandler = asyncHandler(async (req, res) => {
  const request = registerSchema.parse(req.body);

  await createAccount(request);

  return res.status(HTTPSTATUS.CREATED).json({
    message: "Account created successfully.",
  });
});

export const loginHandler = asyncHandler(async (req, res) => {
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });
  const { accessToken, refreshToken } = await loginUser(request);

  // set cookies
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(HTTPSTATUS.OK)
    .json({ message: "Login successful" });
});

export const logoutHandler = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  const { payload } = verifyToken(accessToken || "");

  if (payload) {
    // remove current session from db
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }

  // clear cookies
  return clearAuthCookies(res)
    .status(HTTPSTATUS.OK)
    .json({ message: "Logout successful" });
});

export const refreshHandler = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;
  appAssert(refreshToken, HTTPSTATUS.UNAUTHORIZED, "Missing refresh token");

  const { accessToken, newRefreshToken } =
    await refreshUserAccessToken(refreshToken);

  if (newRefreshToken) {
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
  }

  return res
    .status(HTTPSTATUS.OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({ message: "Access token refreshed" });
});

export const setInitialPasswordHandler = asyncHandler(async (req, res) => {
  const request = setInitialPasswordSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
    code: req.params.code,
  });

  const { user, accessToken, refreshToken } = await setInitialPassword(request);

  return setAuthCookies({ res, accessToken, refreshToken })
    .status(HTTPSTATUS.OK)
    .json(user);
});

export const sendPasswordResetHandler = asyncHandler(async (req, res) => {
  const email = emailSchema.parse(req.body.email);

  await sendPasswordResetEmail(email);

  return res
    .status(HTTPSTATUS.OK)
    .json({ message: "Password reset email sent" });
});

export const resetPasswordHandler = asyncHandler(async (req, res) => {
  const request = resetPasswordSchema.parse(req.body);

  await resetPassword(request);

  return clearAuthCookies(res)
    .status(HTTPSTATUS.OK)
    .json({ message: "Password was reset successfully" });
});
