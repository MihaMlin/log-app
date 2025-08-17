import mongoose from "mongoose";
import { RequestHandler } from "express";
import { HTTPSTATUS } from "../constants/http";
import { AppErrorCode } from "../constants/appErrorCode";
import appAssert from "../utils/appAssert";
import { verifyToken } from "../utils/jwt";

const authenticate: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  appAssert(
    accessToken,
    HTTPSTATUS.UNAUTHORIZED,
    "Unauthorized",
    AppErrorCode.InvalidAccessToken
  );

  const { error, payload } = verifyToken(accessToken);
  appAssert(
    payload,
    HTTPSTATUS.UNAUTHORIZED,
    error === "jwt expired" ? "Token expired" : "Invalid token",
    AppErrorCode.InvalidAccessToken
  );

  req.userId = new mongoose.Types.ObjectId(payload.userId);
  req.sessionId = new mongoose.Types.ObjectId(payload.sessionId);
  req.isAdmin = payload.role === "admin";
  next();
};

export { authenticate };
