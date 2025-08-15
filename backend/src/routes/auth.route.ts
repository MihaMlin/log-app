import { Router } from "express";
import {
  registerHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  setInitialPasswordHandler,
  sendPasswordResetHandler,
  resetPasswordHandler,
} from "../controllers/auth.controller";
import { authenticateAdmin } from "../middleware/authenticate";

const authRoutes = Router();

// prefix: /auth
authRoutes.post("/register", authenticateAdmin, registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/logout", logoutHandler);
authRoutes.get("/refresh", refreshHandler);
authRoutes.post("/password/set/:code", setInitialPasswordHandler);
authRoutes.post("/password/forgot", sendPasswordResetHandler);
authRoutes.post("/password/reset", resetPasswordHandler);

export default authRoutes;
