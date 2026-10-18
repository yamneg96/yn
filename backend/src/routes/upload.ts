import fs from "node:fs/promises";
import path from "node:path";
import { Router } from "express";
import { env } from "../config/env";
import { imageUpload } from "../middleware/upload";
import { ApiError, asyncHandler } from "../utils/http";

// Relative to the working directory (the backend/ folder) so it is identical in dev and in dist/.
export const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");

const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";

const imagekitConfigured = () => Boolean(env.IMAGEKIT_PRIVATE_KEY && env.IMAGEKIT_URL_ENDPOINT);

/** Sends the file to ImageKit's upload API and returns its public CDN URL. */
async function uploadToImageKit(file: Express.Multer.File, fileName: string): Promise<string> {
  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(file.buffer)], { type: file.mimetype }), fileName);
  form.append("fileName", fileName);
  form.append("folder", `/${env.IMAGEKIT_FOLDER.replace(/^\/+|\/+$/g, "")}`);
  form.append("useUniqueFileName", "true");

  let response: Response;
  try {
    response = await fetch(IMAGEKIT_UPLOAD_URL, {
      method: "POST",
      headers: { Authorization: `Basic ${Buffer.from(`${env.IMAGEKIT_PRIVATE_KEY}:`).toString("base64")}` },
      body: form,
    });
  } catch {
    throw new ApiError(502, "Could not reach ImageKit");
  }

  const payload = (await response.json().catch(() => ({}))) as { url?: string; message?: string };
  if (!response.ok || !payload.url) {
    throw new ApiError(502, `ImageKit upload failed: ${payload.message ?? response.statusText}`);
  }
  return payload.url;
}

const router = Router();

router.post("/", imageUpload, asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) throw new ApiError(400, "No file provided");

  const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");

  // Production: ImageKit CDN when credentials are configured.
  if (imagekitConfigured()) {
    return res.status(201).json({ url: await uploadToImageKit(file, safeName) });
  }

  // Development fallback: store on local disk and serve from /uploads.
  const key = `${Date.now()}-${safeName}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, key), file.buffer);
  res.status(201).json({ url: `${env.PUBLIC_URL}/uploads/${key}` });
}));

export default router;
