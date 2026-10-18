import crypto from "node:crypto";
import { Router } from "express";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import { Message } from "../models";
import { validate } from "../middleware/validate";
import { messageSchema, messageStatusSchema } from "../validation/schemas";
import { ApiError, asyncHandler, serialize, serializeMany } from "../utils/http";

const hashIp = (ip: string | undefined) =>
  ip ? crypto.createHash("sha256").update(ip).digest("hex").slice(0, 24) : undefined;

/** 5 requests per hour per IP: plenty for a real person, painful for a bot. */
const sendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: process.env.NODE_ENV === "test" ? 1000 : 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "You've sent a few messages already. Please try again in an hour, or email me directly." },
});

/** Public: the portfolio's contact form posts here. */
export const publicMessagesRouter = Router();
publicMessagesRouter.post(
  "/",
  sendLimiter,
  validate(messageSchema),
  asyncHandler(async (req, res) => {
    const { website, ...data } = req.body as { website?: string; name: string; email: string; topic: string; message: string };
    // Honeypot: bots fill every field. Pretend it worked so they don't adapt, store nothing.
    if (website && website.trim() !== "") return res.status(201).json({ ok: true });

    await Message.create({
      ...data,
      ipHash: hashIp(req.ip),
      userAgent: String(req.headers["user-agent"] ?? "").slice(0, 300),
    });
    res.status(201).json({ ok: true });
  })
);

/** Admin: inbox. */
export const adminMessagesRouter = Router();

adminMessagesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const status = String(req.query.status ?? "");
    const filter = ["new", "read", "archived"].includes(status) ? { status } : {};
    const [docs, unread] = await Promise.all([
      Message.find(filter).sort({ createdAt: -1 }).limit(300).lean(),
      Message.countDocuments({ status: "new" }),
    ]);
    res.json({ items: serializeMany(docs), unread });
  })
);

// Registered before "/:id" so "read-all" is not parsed as an id.
adminMessagesRouter.post(
  "/read-all",
  asyncHandler(async (_req, res) => {
    const result = await Message.updateMany({ status: "new" }, { $set: { status: "read", readAt: new Date() } });
    res.json({ updated: result.modifiedCount });
  })
);

adminMessagesRouter.patch(
  "/:id",
  validate(messageStatusSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid id");
    const { status } = req.body as { status: string };
    const update = status === "new" ? { $set: { status }, $unset: { readAt: 1 } } : { $set: { status, readAt: new Date() } };
    const doc = await Message.findByIdAndUpdate(id, update, { returnDocument: "after" }).lean();
    if (!doc) throw new ApiError(404, "Not found");
    res.json(serialize(doc));
  })
);

adminMessagesRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid id");
    const doc = await Message.findByIdAndDelete(id).lean();
    if (!doc) throw new ApiError(404, "Not found");
    res.status(204).end();
  })
);
