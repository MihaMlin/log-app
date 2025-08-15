import { z } from "zod";
import { HTTPSTATUS } from "../constants/http";
import SessionModel from "../models/session.model";
import asyncHandler from "../middleware/asyncHandler";
import appAssert from "../utils/appAssert";

export const getSessionsHandler = asyncHandler(async (req, res) => {
  const sessions = await SessionModel.find(
    {
      userId: req.userId,
      expiresAt: { $gt: Date.now() },
    },
    {
      _id: 1,
      userAgent: 1,
      createdAt: 1,
    },
    {
      sort: { createdAt: -1 },
    }
  );

  return res.status(HTTPSTATUS.OK).json(
    // mark the current session
    sessions.map((session) => ({
      ...session.toObject(),
      ...(session.id === req.sessionId && {
        isCurrent: true,
      }),
    }))
  );
});

export const deleteSessionHandler = asyncHandler(async (req, res) => {
  const sessionId = z.string().parse(req.params.id);
  const deleted = await SessionModel.findOneAndDelete({
    _id: sessionId,
    userId: req.userId,
  });
  appAssert(deleted, HTTPSTATUS.NOT_FOUND, "Session not found");
  return res.status(HTTPSTATUS.OK).json({ message: "Session removed" });
});
