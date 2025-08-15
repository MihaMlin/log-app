import { HTTPSTATUS } from "../constants/http";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import asyncHandler from "../middleware/asyncHandler";

export const getUserHandler = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, HTTPSTATUS.NOT_FOUND, "User not found");
  return res.status(HTTPSTATUS.OK).json(user.omitPassword());
});
