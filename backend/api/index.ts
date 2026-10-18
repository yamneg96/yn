import type { IncomingMessage, ServerResponse } from "node:http";
import { createApp } from "../src/app";
import { connectDb } from "../src/config/db";

/**
 * Vercel serverless entry. vercel.json rewrites every path here, so Express keeps doing the routing.
 * The app and the Mongo connection are created once per warm instance and reused between requests.
 */
const app = createApp();
let connecting: Promise<unknown> | null = null;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  connecting ??= connectDb().catch((err) => {
    connecting = null; // retry on the next request
    console.error("[db] connection failed:", (err as Error).message);
  });
  await connecting;
  return app(req, res);
}
