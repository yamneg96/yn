import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

// Tests supply their own environment and must never read a developer's real .env.
if (process.env.NODE_ENV !== "test") {
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });
}

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  PUBLIC_URL: z.string().optional(),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  ADMIN_EMAIL: z.string().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  // ImageKit (https://imagekit.io): when all three are set, uploads go to the CDN; otherwise to ./uploads.
  IMAGEKIT_PUBLIC_KEY: z.string().optional(),
  IMAGEKIT_PRIVATE_KEY: z.string().optional(),
  IMAGEKIT_URL_ENDPOINT: z.string().optional(),
  IMAGEKIT_FOLDER: z.string().default("yn-portfolio"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
  throw new Error(`Invalid environment configuration:\n${issues}`);
}

export const env = {
  ...parsed.data,
  PUBLIC_URL: parsed.data.PUBLIC_URL ?? `http://localhost:${parsed.data.PORT}`,
  isProd: parsed.data.NODE_ENV === "production",
};
