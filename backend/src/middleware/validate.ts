import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { ApiError } from "../utils/http";

/** Validates req.body against a zod schema and replaces it with the parsed value. */
export const validate =
  (schema: ZodType): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fields = Object.fromEntries(
        result.error.issues.map((i) => [i.path.join(".") || "_", i.message])
      );
      return next(new ApiError(400, "Validation failed", fields));
    }
    req.body = result.data;
    next();
  };
