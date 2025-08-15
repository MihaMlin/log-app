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

  req.userId = payload.userId;
  req.sessionId = payload.sessionId;
  req.role = payload.role;
  next();
};

const authenticateAdmin: RequestHandler = (req, res, next) => {
  authenticate(req, res, () => {
    appAssert(
      req.role === "admin",
      HTTPSTATUS.FORBIDDEN,
      "Admin access required",
      AppErrorCode.Forbidden
    );
    next();
  });
};

export { authenticate, authenticateAdmin };
