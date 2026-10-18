import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import routes from "./routes";
import home from "./routes/home";
import { UPLOAD_DIR } from "./routes/upload";
import { errorHandler, notFound } from "./middleware/error";

export function createApp() {
  const app = express();

  // Required so secure cookies work behind Render/Vercel/Nginx proxies.
  app.set("trust proxy", 1);

  app.use(
    helmet({
      // Locally uploaded images are loaded by the SPA from a different origin.
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
  app.use(
    cors({
      origin: env.CLIENT_URL.split(",").map((o) => o.trim()),
      credentials: true,
    })
  );
  if (env.NODE_ENV !== "test") app.use(morgan(env.isProd ? "combined" : "dev"));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "7d" }));
  app.use("/api", routes);
  app.use("/", home);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
