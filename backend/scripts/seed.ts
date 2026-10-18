/**
 * Seeds MongoDB with the résumé-accurate portfolio content and the admin user.
 *
 *   npm run seed              fill collections that are EMPTY (never overwrites CMS edits)
 *   npm run seed -- --reset   wipe all content collections (not messages or users) and reseed
 *
 * The admin user is always upserted from ADMIN_EMAIL / ADMIN_PASSWORD.
 */
import bcrypt from "bcryptjs";
import type { Model } from "mongoose";
import { connectDb, disconnectDb } from "../src/config/db";
import { env } from "../src/config/env";
import {
  AdminUser,
  ApproachStep,
  ExperienceItem,
  Project,
  SiteSettings,
  SocialLink,
  StackLayer,
  Testimonial,
} from "../src/models";
import { approachSteps, projects, stackLayers, testimonials } from "./seed-data";

const RESET = process.argv.includes("--reset");

async function seedCollection(name: string, model: Model<any>, rows: Record<string, unknown>[]) {
  if (RESET) await model.deleteMany({});
  const existing = await model.countDocuments();
  if (existing > 0) {
    console.log(`[seed] ${name}: ${existing} existing — skipped (use --reset to replace)`);
    return;
  }
  await model.insertMany(rows);
  console.log(`[seed] ${name}: inserted ${rows.length}`);
}

async function seedAdminUser() {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    console.warn("[seed] ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user");
    return;
  }
  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
  const email = env.ADMIN_EMAIL.toLowerCase();
  await AdminUser.findOneAndUpdate({ email }, { email, passwordHash }, { upsert: true, setDefaultsOnInsert: true });
  console.log(`[seed] admin user ready: ${email}`);
}

const settings = {
  fullName: "Yamlak Negash",
  initials: "YN",
  location: "Addis Ababa",
  coordinates: "9.03°N 38.74°E",
  timezone: "Africa/Addis_Ababa",
  timezoneLabel: "EAT",
  availability: "Open to new opportunities",
  available: true,
  heroTitle: "I build production software that ships, scales, and gets used.",
  heroHighlight: "ships, scales, and gets used.",
  heroRoles: ["Full-stack engineer", "Mobile engineer", "Fintech integrations", "Real-time systems", "Applied AI"],
  heroSubtitle:
    "Full-stack and mobile engineer who has independently shipped 20+ systems across fintech, healthcare, logistics, hospitality and education. Several are live with real users, real payments and real-time traffic.",
  resumeUrl: "/Yamlak_Resume.pdf",
  stats: [
    { value: 20, suffix: "+", label: "Production systems shipped" },
    { value: 9, suffix: "", label: "Banks & money providers integrated" },
    { value: 400, suffix: "+", label: "Source files in one monorepo" },
    { value: 260, suffix: "+", label: "Commits on a single project" },
  ],
  email: "yamlaknegash96@gmail.com",
  phone: "+251 902 142 767",
  aboutHeading: "An engineer who owns the product end to end.",
  aboutIntro:
    "React, Next.js and React Native on the front. Node, Express and NestJS behind them. MongoDB or PostgreSQL underneath, with real-time and security designed in from the first commit.",
  principle: "Ship the whole slice: interface, API and data, for one real workflow at a time.",
  principleTags: ["Turborepo / pnpm", "JWT · RBAC · multi-tenant", "Socket.IO real-time", "Chapa · Stripe · CBE"],
  dailyStack: ["React", "Next.js", "TypeScript", "Node.js", "Express", "Python / AI"],
  timezoneNote: "UTC+3, with overlap for Europe and the Gulf.",
  learningNote: "Tech enthusiast with a taste for hard systems.",
  ctaHeading: "Have something that needs to ship?",
  contactHeading: "Ready to build something that ships?",
  contactHighlight: "ships?",
  contactIntro: "Tell me what you're building, who it's for and when it needs to be live. I reply to every serious message.",
  insideScoop:
    "Leading NYDev: production systems across fintech, health-tech and edtech, from national blood-bank logistics to AI tutoring.",
  scoopRole: "Lead Full-Stack Developer",
  scoopSince: "Oct 2025 – now",
  educationSchool: "Addis Ababa University",
  educationDegree: "B.Sc. Software Engineering · expected 2027",
  languages: "English (professional) · Amharic (native)",
};

const experience = [
  {
    title: "Lead Full-Stack Developer",
    company: "NYDev · independent studio",
    period: "Oct 2025 — Present",
    description:
      "Designed and built production-track systems across fintech, healthcare-adjacent, logistics, hospitality and edtech: DonorLink, TrustPay, NYDL, Lumora and more. Several are deployed live.",
    tags: ["DonorLink", "TrustPay", "NYDL", "Lumora"],
  },
  {
    title: "Software Engineering Intern",
    company: "PISpace Technology",
    period: "Mar — Jul 2026",
    description:
      "Full-stack and frontend work on a production ERP, focused on the accounting module: React, Vite, TypeScript, Tailwind and shadcn/ui against Node/Express/MongoDB APIs, plus a React Native receipt-capture companion app using ML Kit.",
    tags: ["React / Vite", "TanStack Query", "Zustand", "React Native"],
  },
  {
    title: "Lead Frontend Developer & Project Manager",
    company: "University Medical Collaboration",
    period: "University project",
    description:
      "Led a multidisciplinary team building a hospital bed-availability and procedure-notification system, turning Figma designs into production React with real-time monitoring. It grew into a full MERN + mobile product with 260+ commits.",
    tags: ["MERN", "Expo", "Cron expiry", "Gemini / Groq"],
  },
  {
    title: "Lead Frontend Developer",
    company: "Ethronics",
    period: "Previous",
    description:
      "Built JobsPark, a recruitment platform, end to end: React frontend, Express/MongoDB backend, JWT auth with RBAC, and Chapa payment integration.",
    tags: ["React", "Express", "Chapa"],
  },
].map((e, order) => ({ ...e, order, published: true }));

const socialLinks = [
  { platform: "GitHub", url: "https://github.com/yamneg96" },
  { platform: "LinkedIn", url: "https://www.linkedin.com/in/yamlak-negash-43827a399" },
  { platform: "Portfolio", url: "https://yamlak.vercel.app" },
  { platform: "Upwork", url: "https://www.upwork.com/freelancers/~01f9a25c19a4aae39e", note: "Available for hire" },
].map((s, order) => ({ ...s, order }));

async function main() {
  await connectDb();
  console.log(`[seed] connected${RESET ? " (RESET mode: existing content will be replaced)" : ""}`);

  await seedAdminUser();
  await seedCollection("settings", SiteSettings, [settings]);
  await seedCollection("projects", Project, projects as Record<string, unknown>[]);
  await seedCollection("experience", ExperienceItem, experience);
  await seedCollection("approach", ApproachStep, approachSteps);
  await seedCollection("stack layers", StackLayer, stackLayers);
  await seedCollection("testimonials", Testimonial, testimonials);
  await seedCollection("social links", SocialLink, socialLinks);
  console.log("[seed] done");
}

main()
  .catch((err) => {
    console.error("[seed] failed:", err.message ?? err);
    process.exitCode = 1;
  })
  .finally(() => disconnectDb());
