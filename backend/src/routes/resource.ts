import { Router } from "express";
import mongoose, { type Model } from "mongoose";
import type { ZodObject, ZodRawShape } from "zod";
import { validate } from "../middleware/validate";
import { reorderSchema } from "../validation/schemas";
import { ApiError, asyncHandler, serialize, serializeMany } from "../utils/http";

type ResourceOptions = {
  model: Model<any>;
  schema: ZodObject<ZodRawShape>;
  /** When true, the public list only returns documents with `published: true`. */
  hasPublished?: boolean;
  /** Runs on the validated body before it is written (e.g. to derive a slug). */
  prepare?: (body: any) => any;
};

function assertId(id: string) {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid id");
}

/**
 * Builds the public (read-only) and admin (full CRUD + reorder) routers for a
 * collection so every content type behaves identically.
 */
export function createResource({ model, schema, hasPublished = false, prepare = (b) => b }: ResourceOptions) {
  const keys = Object.keys(schema.shape);
  const sort = { order: 1, createdAt: 1 } as const;

  const publicRouter = Router();
  publicRouter.get(
    "/",
    asyncHandler(async (_req, res) => {
      const filter = hasPublished ? { published: true } : {};
      res.json(serializeMany(await model.find(filter).sort(sort).lean()));
    })
  );

  const adminRouter = Router();

  adminRouter.get(
    "/",
    asyncHandler(async (_req, res) => {
      res.json(serializeMany(await model.find().sort(sort).lean()));
    })
  );

  adminRouter.post(
    "/",
    validate(schema),
    asyncHandler(async (req, res) => {
      const created = await model.create(prepare(req.body));
      res.status(201).json(serialize(created.toObject()));
    })
  );

  // Must be registered before "/:id" so "reorder" is not parsed as an id.
  adminRouter.put(
    "/reorder",
    validate(reorderSchema),
    asyncHandler(async (req, res) => {
      const ids: string[] = req.body.ids;
      ids.forEach(assertId);
      await model.bulkWrite(
        ids.map((id, index) => ({
          updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
        }))
      );
      res.json({ ok: true });
    })
  );

  adminRouter.put(
    "/:id",
    validate(schema),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      assertId(id);

      // Optional fields that were cleared in the form arrive as undefined and
      // must be $unset, otherwise Mongoose would silently keep the old value.
      const body = prepare(req.body);
      const $set: Record<string, unknown> = {};
      const $unset: Record<string, 1> = {};
      for (const key of keys) {
        if (body[key] === undefined) $unset[key] = 1;
        else $set[key] = body[key];
      }

      const updated = await model
        .findByIdAndUpdate(id, { $set, ...(Object.keys($unset).length ? { $unset } : {}) }, { returnDocument: "after", runValidators: true })
        .lean();
      if (!updated) throw new ApiError(404, "Not found");
      res.json(serialize(updated));
    })
  );

  adminRouter.delete(
    "/:id",
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      assertId(id);
      const deleted = await model.findByIdAndDelete(id).lean();
      if (!deleted) throw new ApiError(404, "Not found");
      res.status(204).end();
    })
  );

  return { publicRouter, adminRouter };
}
