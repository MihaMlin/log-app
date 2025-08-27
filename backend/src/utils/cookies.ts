import { CookieOptions, Response } from "express";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date";
import { Env } from "../config/env.config";

export const REFRESH_PATH = "/auth/refresh";

const defaults: CookieOptions = {
  sameSite: Env.NODE_ENV === "development" ? "none" : "lax",
  httpOnly: true,
  secure: Env.NODE_ENV === "development",
  domain:
    Env.NODE_ENV === "development" ? "log-app-zgj4.onrender.com" : undefined,
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: fifteenMinutesFromNow(),
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: thirtyDaysFromNow(),
  path: REFRESH_PATH,
});

type Params = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};
export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) =>
  res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

export const clearAuthCookies = (res: Response) =>
  res
    .clearCookie("accessToken", { ...defaults, path: "/" })
    .clearCookie("refreshToken", { ...defaults, path: REFRESH_PATH });
