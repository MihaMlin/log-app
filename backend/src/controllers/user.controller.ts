import { HTTPSTATUS } from "../constants/http";
import UserModel from "../models/user.model";
import asyncHandler from "../middleware/asyncHandler";
import { clearAuthCookies } from "../utils/cookies";

export const getUserHandler = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.userId);

  if (user) {
    return res.status(HTTPSTATUS.OK).json(user.omitPassword());
  }

  // clear cookies
  return clearAuthCookies(res)
    .status(HTTPSTATUS.NOT_FOUND)
    .json({ message: "User not found" });
});
