import { Router } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { AdminUser } from "../models";
import { COOKIE_NAME, cookieOptions, requireAuth, signToken } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { loginSchema } from "../validation/schemas";
import { ApiError, asyncHandler } from "../utils/http";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again in 15 minutes." },
});

router.post(
  "/login",
  loginLimiter,
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body as { email: string; password: string };
    const user = await AdminUser.findOne({ email: email.toLowerCase() });

    // Same error for unknown email and wrong password: don't reveal which exists.
    const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!user || !valid) throw new ApiError(401, "Invalid email or password");

    const token = signToken({ sub: String(user._id), email: user.email });
    res.cookie(COOKIE_NAME, token, cookieOptions());
    // The JWT is deliberately NOT returned in the body: keeping it httpOnly-only
    // means page JavaScript (and any XSS) can never read it.
    res.json({ user: { id: String(user._id), email: user.email } });
  })
);

router.post("/logout", (_req, res) => {
  const { maxAge: _maxAge, ...options } = cookieOptions();
  res.clearCookie(COOKIE_NAME, options);
  res.json({ ok: true });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
