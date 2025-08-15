import mongoose from "mongoose";
import { UserRoleType } from "../constants/userRoleType";

declare global {
  namespace Express {
    interface Request {
      userId: mongoose.Types.ObjectId;
      sessionId: mongoose.Types.ObjectId;
      role: UserRoleType;
    }
  }
}
export {};
