import type { ErrorRequestHandler, RequestHandler } from "express";
import mongoose from "mongoose";
import { env } from "../config/env";
import { ApiError } from "../utils/http";

export const notFound: RequestHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ error: "Validation failed", details: err.message });
  }
  // Unique index violation (e.g. a project slug that already exists).
  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern ?? err.keyValue ?? {})[0] ?? "value";
    return res.status(409).json({ error: "Already in use", details: { [field]: `That ${field} is already taken` } });
  }
  if (err?.name === "MulterError") {
    return res.status(400).json({ error: err.message });
  }

  console.error("[error]", err);
  res.status(500).json({
    error: "Internal server error",
    ...(env.isProd ? {} : { details: String(err?.message ?? err) }),
  });
};
