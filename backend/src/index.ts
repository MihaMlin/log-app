import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { Env } from "./config/env.config";
import connectToDatabase from "./config/db.config";
import { HTTPSTATUS } from "./constants/http";
import { authenticate } from "./middleware/authenticate";
import errorHandler from "./middleware/errorHandler";
import notFoundHandler from "./middleware/notFoundHandler";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import sessionRoutes from "./routes/session.route";
import projectRoutes from "./routes/project.route";
import logRoutes from "./routes/log.route";

const app = express();
const BASE_PATH = Env.BASE_PATH;

// add middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: Env.APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

// health check
app.get("/health", (req, res) => {
  return res.status(HTTPSTATUS.OK).json({
    success: true,
    status: "healthy",
  });
});

// auth routes
app.use(`${BASE_PATH}/auth`, authRoutes);

// protected routes
app.use(`${BASE_PATH}/users`, authenticate, userRoutes);
app.use(`${BASE_PATH}/sessions`, authenticate, sessionRoutes);
app.use(`${BASE_PATH}/projects`, authenticate, projectRoutes);
app.use(`${BASE_PATH}/logs`, authenticate, logRoutes);

// 404 handler
app.use(notFoundHandler());

// error handler
app.use(errorHandler);

app.listen(Env.PORT, async () => {
  console.log(
    `Server listening on port ${Env.PORT} in ${Env.NODE_ENV} environment`
  );
  await connectToDatabase();
});
