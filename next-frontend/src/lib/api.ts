import API from "./axios-client";

type LoginType = {
  email: string;
  password: string;
};

type RegisterType = {
  email: string;
  role: "user" | "admin";
};

type SetInitialPasswordType = {
  password: string;
  confirmPassword: string;
  verificationCode: string;
};

type ResendVerifyEmailType = {
  email: string;
};

type ForgotPasswordType = {
  email: string;
};

type ResetPasswordType = {
  password: string;
  verificationCode: string;
};

export const loginMutationFn = async (data: LoginType) =>
  await API.post("/auth/login", data);

export const registerUserMutationFn = async (data: RegisterType) =>
  await API.post("/auth/register", data);

export const logoutMutationFn = async () => await API.post("/auth/logout");

export const setInitialPasswordMutationFn = async (
  data: SetInitialPasswordType
) => {
  const { verificationCode, ...body } = data;
  await API.post(`/auth/password/set/${verificationCode}`, body);
};

export const resendVerifyEmailMutationFn = async (
  data: ResendVerifyEmailType
) => await API.post(`/auth/email/verify/resend`, data);

export const forgotPasswordMutationFn = async (data: ForgotPasswordType) =>
  await API.post(`/auth/password/forgot`, data);

export const resetPasswordMutationFn = async (data: ResetPasswordType) =>
  await API.post(`/auth/password/reset`, data);
