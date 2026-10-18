import multer from "multer";
import { ApiError } from "../utils/http";

// Images for covers and avatars, plus PDF for the résumé.
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif", "image/avif", "application/pdf"];

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new ApiError(400, "Unsupported file type. Use an image or a PDF.") as unknown as Error);
    }
    cb(null, true);
  },
}).single("file");
