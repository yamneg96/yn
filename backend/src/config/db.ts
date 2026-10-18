import mongoose from "mongoose";
import { env } from "./env";

export async function connectDb() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  return mongoose.connection;
}

let pending: Promise<unknown> | null = null;

/** Connects once and reuses the connection; used by serverless hosts where nothing calls connectDb() at boot. */
export function ensureDb(): Promise<unknown> {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  pending ??= connectDb().catch((err) => {
    pending = null; // retry on the next request
    throw err;
  });
  return pending;
}

export async function disconnectDb() {
  await mongoose.connection.close();
}
