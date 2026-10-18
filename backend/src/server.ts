import { createApp } from "./app";
import { connectDb, disconnectDb } from "./config/db";
import { env } from "./config/env";

async function main() {
  const app = createApp();

  // Start listening even if Mongo is briefly unavailable so /api/health can
  // report the problem instead of the process exiting silently.
  const server = app.listen(env.PORT, () => {
    console.log(`[api] listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });

  try {
    await connectDb();
    console.log("[db] connected to MongoDB");
  } catch (err) {
    console.error("[db] connection failed:", (err as Error).message);
    console.error("[db] Check MONGODB_URI in backend/.env. API will return 500 for data routes until it connects.");
  }

  const shutdown = async (signal: string) => {
    console.log(`[api] ${signal} received — shutting down`);
    server.close(async () => {
      await disconnectDb().catch(() => undefined);
      process.exit(0);
    });
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main();
