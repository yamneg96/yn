import { Router } from "express";
import mongoose from "mongoose";
import {
  ApproachStep,
  ExperienceItem,
  Message,
  Project,
  SiteSettings,
  SocialLink,
  StackLayer,
  Testimonial,
} from "../models";
import {
  approachStepSchema,
  experienceSchema,
  projectSchema,
  slugify,
  socialLinkSchema,
  stackLayerSchema,
  testimonialSchema,
} from "../validation/schemas";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/http";
import authRouter from "./auth";
import uploadRouter from "./upload";
import { adminSettingsRouter, publicSettingsRouter } from "./settings";
import { createResource } from "./resource";
import { adminMessagesRouter, publicMessagesRouter } from "./messages";

const projects = createResource({
  model: Project,
  schema: projectSchema,
  hasPublished: true,
  prepare: (b) => ({ ...b, slug: b.slug || slugify(b.title) }),
});
const experience = createResource({ model: ExperienceItem, schema: experienceSchema, hasPublished: true });
const approach = createResource({ model: ApproachStep, schema: approachStepSchema });
const stackLayers = createResource({ model: StackLayer, schema: stackLayerSchema });
const testimonials = createResource({ model: Testimonial, schema: testimonialSchema });
const socialLinks = createResource({ model: SocialLink, schema: socialLinkSchema });

const api = Router();

api.get("/health", (_req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  res.json({
    status: "ok",
    uptime: Math.round(process.uptime()),
    database: states[mongoose.connection.readyState] ?? "unknown",
  });
});

api.use("/auth", authRouter);

// ---- Public, read-only content (consumed by the React site) ----
api.use("/settings", publicSettingsRouter);
api.use("/projects", projects.publicRouter);
api.use("/experience", experience.publicRouter);
api.use("/approach", approach.publicRouter);
api.use("/stack", stackLayers.publicRouter);
api.use("/testimonials", testimonials.publicRouter);
api.use("/social-links", socialLinks.publicRouter);
api.use("/messages", publicMessagesRouter);

// ---- Admin (JWT required): full CRUD, reorder, upload, overview ----
const admin = Router();
admin.use(requireAuth);

admin.get(
  "/overview",
  asyncHandler(async (_req, res) => {
    const sections = [
      { key: "settings", label: "Settings", href: "/admin/settings", model: SiteSettings },
      { key: "projects", label: "Projects", href: "/admin/projects", model: Project },
      { key: "experience", label: "Experience", href: "/admin/experience", model: ExperienceItem },
      { key: "approach", label: "Approach", href: "/admin/approach", model: ApproachStep },
      { key: "stack", label: "Stack", href: "/admin/stack", model: StackLayer },
      { key: "testimonials", label: "Testimonials", href: "/admin/testimonials", model: Testimonial },
      { key: "socialLinks", label: "Social Links", href: "/admin/social-links", model: SocialLink },
      { key: "messages", label: "Messages", href: "/admin/messages", model: Message },
    ];

    const result = await Promise.all(
      sections.map(async ({ model, ...meta }) => {
        const [count, latest] = await Promise.all([
          model.countDocuments(),
          model.findOne().sort({ updatedAt: -1 }).select("updatedAt").lean<{ updatedAt?: Date }>(),
        ]);
        const extra = meta.key === "messages" ? { unread: await Message.countDocuments({ status: "new" }) } : {};
        return { ...meta, count, updatedAt: latest?.updatedAt ?? null, ...extra };
      })
    );
    res.json(result);
  })
);

admin.use("/settings", adminSettingsRouter);
admin.use("/projects", projects.adminRouter);
admin.use("/experience", experience.adminRouter);
admin.use("/approach", approach.adminRouter);
admin.use("/stack", stackLayers.adminRouter);
admin.use("/testimonials", testimonials.adminRouter);
admin.use("/social-links", socialLinks.adminRouter);
admin.use("/messages", adminMessagesRouter);
admin.use("/upload", uploadRouter);

api.use("/admin", admin);

export default api;
