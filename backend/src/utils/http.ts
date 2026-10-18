import type { NextFunction, Request, RequestHandler, Response } from "express";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
  }
}

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };

/** Converts a lean Mongo document into the JSON shape the web app consumes. */
export function serialize<T extends Record<string, any>>(doc: T) {
  const { _id, __v, ...rest } = doc;
  return { id: String(_id), ...rest };
}

export const serializeMany = <T extends Record<string, any>>(docs: T[]) => docs.map(serialize);
