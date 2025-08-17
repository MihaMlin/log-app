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
import { authenticate } from "../middleware/authenticate";
import { authorizeAdmin } from "../middleware/authorize";
const authRoutes = Router();

// prefix: /auth
authRoutes.post("/register", authenticate, authorizeAdmin, registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/logout", logoutHandler);
authRoutes.get("/refresh", refreshHandler);
authRoutes.post("/password/set/:code", setInitialPasswordHandler);
authRoutes.post("/password/forgot", sendPasswordResetHandler);
authRoutes.post("/password/reset", resetPasswordHandler);

export default authRoutes;
