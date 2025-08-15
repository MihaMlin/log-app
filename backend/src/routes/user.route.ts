import { Router } from "express";
import { getUserHandler } from "../controllers/user.controller";

const userRoutes = Router();

// prefix: /users
userRoutes.get("/me", getUserHandler);

export default userRoutes;
