/* AUTO-GENERATED from Design/index2.html (the approved design). Edit content in the CMS, not here. */
export const projects = [
  {
    "slug": "donorlink",
    "title": "DonorLink — National Blood Logistics Platform",
    "name": "DonorLink",
    "summary": "Six-app monorepo coordinating Ethiopia’s National Blood Bank, regional banks, hospitals and donors.",
    "kind": "Web + Mobile",
    "role": "Lead full-stack",
    "categories": [
      "health",
      "mobile"
    ],
    "accent": "#f43f5e",
    "accent2": "#fb7185",
    "art": "pulse",
    "featured": true,
    "overview": "A national blood logistics platform built as a Turborepo/pnpm monorepo: a national operations portal, a hospital portal, a public donor platform, a React Native donor app, an Express/MongoDB API and a Python (FastAPI) intelligence service.",
    "challenge": "Blood supply is spread across a national bank, regional banks, hospitals and individual donors, and each of them needs the same live picture of stock and demand.",
    "solution": "Real-time inventory and blood-unit lifecycle tracking over Socket.IO, JWT/RBAC-secured REST APIs, and rule-based shortage and expiry forecasting, shared by all six apps from one monorepo.",
    "features": [
      "Blood-unit lifecycle tracking",
      "Real-time inventory over Socket.IO",
      "JWT / RBAC-secured REST APIs",
      "Rule-based shortage and expiry forecasting",
      "React Native donor app",
      "Python (FastAPI) intelligence service"
    ],
    "stack": [
      "React",
      "TypeScript",
      "React Native",
      "Node.js",
      "MongoDB",
      "Socket.IO",
      "FastAPI"
    ],
    "metrics": [
      {
        "value": 6,
        "suffix": "",
        "label": "apps in one monorepo"
      },
      {
        "value": 400,
        "suffix": "+",
        "label": "source files"
      },
      {
        "value": 3,
        "suffix": "",
        "label": "user groups served: banks, hospitals, donors"
      }
    ],
    "arch": {
      "clients": [
        "Donor app",
        "Hospital portal",
        "National ops portal"
      ],
      "api": "Express API",
      "back": [
        "MongoDB",
        "Socket.IO events",
        "FastAPI forecasting"
      ]
    },
    "liveUrl": "https://donor-link-v1.vercel.app/",
    "embedMode": "live",
    "order": 0,
    "published": true
  },
  {
    "slug": "trustpay",
    "title": "TrustPay — Digital Payment Verification Platform",
    "name": "TrustPay",
    "summary": "Direct-to-bank verification across 9 Ethiopian banks and mobile-money providers, with no aggregator in the loop.",
    "kind": "Web + Mobile",
    "role": "Lead full-stack",
    "categories": [
      "fintech",
      "mobile"
    ],
    "accent": "#8b5cf6",
    "accent2": "#a78bfa",
    "art": "hex",
    "featured": true,
    "overview": "A fintech verification platform made of a React Native/Expo merchant app, a React/Vite admin dashboard and a public site. Transactions are verified directly against nine Ethiopian banks and mobile-money providers.",
    "challenge": "Merchants need to confirm that a payment really happened, quickly and without trusting a screenshot or a third-party aggregator.",
    "solution": "Direct bank verification, OCR and QR receipt scanning, dual-token JWT auth with rotating refresh, fraud and duplicate detection with full audit trails, and a public Verifier API product.",
    "features": [
      "Direct-to-bank checks, 9 providers",
      "OCR + QR receipt scanning",
      "Dual-token JWT with rotating refresh",
      "Fraud and duplicate-detection forensics",
      "Verifier API with keys, quotas, signed webhooks",
      "TypeScript SDK and MCP server"
    ],
    "stack": [
      "React Native",
      "Expo",
      "React",
      "Vite",
      "Node.js",
      "MongoDB"
    ],
    "metrics": [
      {
        "value": 9,
        "suffix": "",
        "label": "banks & money providers"
      },
      {
        "value": 2,
        "suffix": "",
        "label": "tokens per session (access + refresh)"
      },
      {
        "value": 3,
        "suffix": "",
        "label": "apps: merchant, admin, public site"
      }
    ],
    "arch": {
      "clients": [
        "Merchant app",
        "Admin dashboard",
        "Public site"
      ],
      "api": "Express API",
      "back": [
        "Bank / provider checks",
        "MongoDB audit trail",
        "Verifier API + webhooks"
      ]
    },
    "liveUrl": "https://trustpay.nydevofficial.org",
    "embedMode": "live",
    "order": 1,
    "published": true
  },
  {
    "slug": "nydl",
    "title": "NYDL — Enterprise Learning Management SaaS",
    "name": "NYDL",
    "summary": "Multi-portal LMS: courses, cohorts, assignments, certificates, badges, payments and analytics.",
    "kind": "Web",
    "role": "Lead full-stack",
    "categories": [
      "edtech"
    ],
    "accent": "#0ea5e9",
    "accent2": "#22d3ee",
    "art": "graph",
    "featured": true,
    "overview": "A multi-portal learning platform with a backend API, a student/instructor web app and an admin console. It is the most mature codebase in the portfolio by file volume.",
    "challenge": "Training organisations need one system for courses and cohorts, assessment, credentials, payments and reporting.",
    "solution": "An Express/MongoDB backend (JWT, Joi, BullMQ, PDF certificate generation) and two React/Vite frontends built on TanStack Router, Query and Table.",
    "features": [
      "Course and cohort management",
      "Assignments, certificates and badges",
      "Payments",
      "Learning analytics",
      "Background jobs with BullMQ",
      "PDF certificate generation"
    ],
    "stack": [
      "React",
      "Vite",
      "TanStack",
      "Node.js",
      "MongoDB",
      "BullMQ"
    ],
    "metrics": [
      {
        "value": 100,
        "suffix": "+",
        "label": "commits"
      },
      {
        "value": 2,
        "suffix": "",
        "label": "React frontends"
      },
      {
        "value": 3,
        "suffix": "",
        "label": "portals: student, instructor, admin"
      }
    ],
    "arch": {
      "clients": [
        "Student / instructor app",
        "Admin console"
      ],
      "api": "Express API",
      "back": [
        "MongoDB",
        "BullMQ jobs",
        "PDF certificates"
      ]
    },
    "liveUrl": "https://nydl.nydevofficial.org",
    "adminUrl": "https://nydl-admin-v1.vercel.app",
    "embedMode": "live",
    "order": 2,
    "published": true
  },
  {
    "slug": "lumora",
    "title": "Lumora — Multi-Tenant EdTech SaaS + AI Tutor",
    "name": "Lumora",
    "summary": "School operations plus an AI mobile tutor: OCR homework capture and English/Amharic voice tutoring.",
    "kind": "Web + Mobile",
    "role": "Lead full-stack",
    "categories": [
      "edtech",
      "ai",
      "mobile"
    ],
    "accent": "#10b981",
    "accent2": "#2dd4bf",
    "art": "stars",
    "featured": true,
    "overview": "Evolved from a school-management concept into a multi-tenant EdTech platform that pairs school operations with “Lumora Tutor”, an AI mobile companion.",
    "challenge": "Students need help in the language they think in, on devices that are not always online.",
    "solution": "Tutoring is routed between on-device (ExecuTorch) and cloud AI, backed by an AI Gateway/RAG layer, a React/TanStack web app with interactive STEM content, and an Expo mobile app.",
    "features": [
      "OCR homework capture",
      "Quiz and flashcard generation",
      "English / Amharic voice tutoring",
      "On-device and cloud AI routing",
      "3D molecules, graphing and LaTeX",
      "Multi-tenant school operations"
    ],
    "stack": [
      "React",
      "TanStack",
      "Expo",
      "Node.js",
      "MongoDB",
      "ExecuTorch",
      "RAG"
    ],
    "metrics": [
      {
        "value": 2,
        "suffix": "",
        "label": "AI routes: on-device and cloud"
      },
      {
        "value": 2,
        "suffix": "",
        "label": "tutoring languages"
      },
      {
        "value": 2,
        "suffix": "",
        "label": "surfaces: web and mobile"
      }
    ],
    "arch": {
      "clients": [
        "Lumora web app",
        "Lumora Tutor (Expo)"
      ],
      "api": "API + AI Gateway",
      "back": [
        "MongoDB",
        "RAG layer",
        "On-device AI (ExecuTorch)"
      ]
    },
    "liveUrl": "https://sjcs-lilac.vercel.app",
    "sourceUrl": "https://github.com/yamneg96/sjcs",
    "embedMode": "blocked",
    "embedNote": "X-Frame-Options: SAMEORIGIN",
    "order": 3,
    "published": true
  },
  {
    "slug": "chereta",
    "title": "Chereta — Trust-First Second-Hand Marketplace",
    "name": "Chereta",
    "summary": "Escrow-style “Safe Deal” payments, a Telegram bot and a RAG support widget for second-hand commerce.",
    "kind": "Web + Mobile",
    "role": "Full-stack · built for Vintage Challenge (VinTech PLC)",
    "categories": [
      "market",
      "ai",
      "mobile"
    ],
    "accent": "#f59e0b",
    "accent2": "#fbbf24",
    "art": "tags",
    "featured": true,
    "overview": "A trust-first marketplace for second-hand goods, with web and mobile apps, built for the Vintage Challenge by VinTech PLC and deployed serverless on Vercel.",
    "challenge": "Buyers and sellers of used goods have to trust each other before any money moves.",
    "solution": "An escrow-style “Safe Deal” flow with real (non-mocked) Chapa payments, a trusted-seller badge via Fayda National ID eSignet or manual review, and chat relayed through a Telegram bot.",
    "features": [
      "“Safe Deal” escrow with real Chapa payments",
      "14-command Telegram bot, buyer to seller",
      "Instagram OAuth listing import",
      "Trusted-seller badge (Fayda eSignet)",
      "RAG support widget over Postgres full-text search",
      "English / Amharic on web and mobile"
    ],
    "stack": [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Socket.IO",
      "Chapa"
    ],
    "metrics": [
      {
        "value": 14,
        "suffix": "",
        "label": "Telegram bot commands"
      },
      {
        "value": 2,
        "suffix": "",
        "label": "trusted-seller paths"
      },
      {
        "value": 2,
        "suffix": "",
        "label": "languages: English, Amharic"
      }
    ],
    "arch": {
      "clients": [
        "Web (Vite/React)",
        "Mobile (Expo)",
        "Telegram bot"
      ],
      "api": "Express + Drizzle",
      "back": [
        "PostgreSQL (Neon)",
        "Chapa payments",
        "RAG support agent"
      ]
    },
    "liveUrl": "https://chereta-web-v1.vercel.app",
    "mobileUrl": "https://expo.dev/accounts/negyam/projects/chereta/builds/c5055067-5b10-49ad-9449-eb254deb141f",
    "embedMode": "live",
    "order": 4,
    "published": true
  },
  {
    "slug": "sjcs-web",
    "title": "SJCS-Web — School Administration Platform",
    "name": "SJCS-Web",
    "summary": "MERN school administration MVP with real-time exam rooms and webcam-based attendance capture.",
    "kind": "Web",
    "role": "Full-stack",
    "categories": [
      "edtech"
    ],
    "accent": "#3b82f6",
    "accent2": "#60a5fa",
    "art": "bars",
    "featured": false,
    "overview": "A second school-administration MVP, independently built on the MERN stack and deployed live.",
    "challenge": "Schools run attendance, academics, payments and exams in separate tools.",
    "solution": "One platform covering attendance, academics, payments and results, plus real-time exam-session rooms over Socket.IO with webcam and MediaPipe-based ID and attendance capture.",
    "features": [
      "Attendance and academics",
      "Payments and results",
      "Real-time exam-session rooms",
      "Webcam / MediaPipe ID capture"
    ],
    "stack": [
      "React",
      "TypeScript",
      "Tailwind",
      "Node.js",
      "MongoDB",
      "Socket.IO"
    ],
    "metrics": [
      {
        "value": 4,
        "suffix": "",
        "label": "core modules"
      },
      {
        "value": 1,
        "suffix": "",
        "label": "live deployment"
      }
    ],
    "arch": {
      "clients": [
        "Admin / teacher app",
        "Student exam room"
      ],
      "api": "Express API",
      "back": [
        "MongoDB",
        "Socket.IO exam rooms",
        "MediaPipe capture"
      ]
    },
    "liveUrl": "https://sjcs-web.vercel.app",
    "sourceUrl": "https://github.com/NY-Development/sjcs-web",
    "embedMode": "down",
    "embedNote": "HTTP 503",
    "order": 5,
    "published": true
  },
  {
    "slug": "bns",
    "title": "Procedure Notifier & Bed Notification System",
    "name": "BNS",
    "summary": "Hospital bed availability and procedure notifications; 260+ commits, the most iterated project.",
    "kind": "Web + Mobile",
    "role": "Frontend lead & project manager",
    "categories": [
      "health",
      "mobile"
    ],
    "accent": "#14b8a6",
    "accent2": "#5eead4",
    "art": "bars",
    "featured": false,
    "overview": "Led a multidisciplinary university team as frontend lead and project manager, turning Figma designs into production React with real-time monitoring workflows.",
    "challenge": "Clinical staff need to know which beds are free and which procedures are coming without chasing people.",
    "solution": "A full MERN + mobile system: Express/MongoDB API, React/Vite web, an Expo staff/admin app, role-based assignment, cron-based scheduled expiry and AI-assisted document features (Gemini/Groq).",
    "features": [
      "Real-time bed availability",
      "Procedure notifications",
      "Role-based assignment",
      "Cron-based scheduled expiry",
      "AI-assisted documents (Gemini / Groq)",
      "Figma to production React"
    ],
    "stack": [
      "React",
      "Vite",
      "Expo",
      "Node.js",
      "MongoDB",
      "Gemini"
    ],
    "metrics": [
      {
        "value": 260,
        "suffix": "+",
        "label": "commits"
      },
      {
        "value": 3,
        "suffix": "",
        "label": "surfaces: API, web, mobile"
      }
    ],
    "arch": {
      "clients": [
        "Staff web app",
        "Staff / admin app (Expo)"
      ],
      "api": "Express API",
      "back": [
        "MongoDB",
        "Cron expiry jobs",
        "Gemini / Groq documents"
      ]
    },
    "liveUrl": "https://bednotify.vercel.app",
    "sourceUrl": "https://github.com/NY-Development/BedNotificationSystem",
    "embedMode": "live",
    "order": 6,
    "published": true
  },
  {
    "slug": "kana",
    "title": "Kana — Wedding Invitation, RSVP & Photo Sharing",
    "name": "Kana",
    "summary": "Multi-tenant platform: any couple spins up a wedding microsite from one shared codebase.",
    "kind": "Web (mobile in progress)",
    "role": "Full-stack",
    "categories": [
      "market"
    ],
    "accent": "#ec4899",
    "accent2": "#f9a8d4",
    "art": "stars",
    "featured": false,
    "overview": "A multi-tenant platform where each couple gets their own wedding microsite (invitations, RSVP and photo sharing) served from one codebase. The Expo mobile companion is in progress.",
    "challenge": "Every wedding wants its own site, but nobody wants to maintain a hundred of them.",
    "solution": "One Node/Express/MongoDB backend, including a scheduled reminder-email cron job, and a React/Tailwind/shadcn-ui web app that renders each tenant’s microsite.",
    "features": [
      "Per-couple microsites",
      "Invitations and RSVP",
      "Photo sharing",
      "Scheduled reminder emails",
      "Expo companion in progress"
    ],
    "stack": [
      "React",
      "TypeScript",
      "Tailwind",
      "Node.js",
      "MongoDB"
    ],
    "metrics": [
      {
        "value": 1,
        "suffix": "",
        "label": "shared codebase"
      },
      {
        "value": 3,
        "suffix": "",
        "label": "features: invitations, RSVP, photos"
      }
    ],
    "arch": {
      "clients": [
        "Couple microsite",
        "Admin web app"
      ],
      "api": "Express API",
      "back": [
        "MongoDB",
        "Reminder cron job",
        "Photo storage"
      ]
    },
    "liveUrl": "https://kana-wedding.vercel.app",
    "embedMode": "live",
    "order": 7,
    "published": true
  },
  {
    "slug": "nuru",
    "title": "Nuru — AI-Assisted Youth Life Navigation",
    "name": "Nuru",
    "summary": "Privacy-first decision support for Ethiopian youth, in Amharic and Afaan Oromo.",
    "kind": "Web",
    "role": "Full-stack · for Mind Lift Ethiopia",
    "categories": [
      "ai"
    ],
    "accent": "#6366f1",
    "accent2": "#a5b4fc",
    "art": "graph",
    "featured": false,
    "overview": "A privacy-first decision-support platform for Ethiopian youth, built for Mind Lift Ethiopia.",
    "challenge": "Young people need guidance they can use privately, in their own language.",
    "solution": "Anonymous Google-authenticated AI chat (xAI/Grok), structured decision-flow wizards and a nearby-clinic finder through Google Maps, on an Express/MongoDB backend with JWT, rate limiting, Swagger docs and Vitest.",
    "features": [
      "Anonymous AI chat (xAI / Grok)",
      "Decision-flow wizards",
      "Nearby-clinic finder (Google Maps)",
      "JWT + Google Sign-In",
      "Swagger docs and Vitest tests",
      "Amharic and Afaan Oromo localization"
    ],
    "stack": [
      "React",
      "TanStack",
      "Tailwind",
      "Node.js",
      "MongoDB"
    ],
    "metrics": [
      {
        "value": 68,
        "suffix": "",
        "label": "commits"
      },
      {
        "value": 2,
        "suffix": "",
        "label": "local languages supported"
      }
    ],
    "arch": {
      "clients": [
        "React web app"
      ],
      "api": "Express API",
      "back": [
        "MongoDB",
        "xAI / Grok chat",
        "Google Maps clinics"
      ]
    },
    "sourceUrl": "https://github.com/yamneg96/Nuru",
    "embedMode": "live",
    "order": 8,
    "published": true
  },
  {
    "slug": "email-helper",
    "title": "Email-Helper — Bilingual Gmail Client",
    "name": "Email-Helper",
    "summary": "Beginner-friendly English/Amharic email client with real Gmail OAuth2 across web, mobile and backend.",
    "kind": "Web + Mobile",
    "role": "Full-stack",
    "categories": [
      "mobile"
    ],
    "accent": "#38bdf8",
    "accent2": "#7dd3fc",
    "art": "bars",
    "featured": false,
    "overview": "A beginner-friendly English/Amharic email client with guided onboarding, compose, reply and templates.",
    "challenge": "First-time email users get lost in dense clients, and few support Amharic.",
    "solution": "Real Gmail OAuth2 integration across a React web app, an Expo mobile app and an Express/MongoDB backend.",
    "features": [
      "Real Gmail OAuth2",
      "Compose, reply and templates",
      "Guided onboarding",
      "English / Amharic interface"
    ],
    "stack": [
      "React",
      "Expo",
      "Node.js",
      "MongoDB"
    ],
    "metrics": [
      {
        "value": 3,
        "suffix": "",
        "label": "surfaces: web, mobile, API"
      },
      {
        "value": 2,
        "suffix": "",
        "label": "interface languages"
      }
    ],
    "arch": {
      "clients": [
        "React web app",
        "Expo mobile app"
      ],
      "api": "Express API",
      "back": [
        "MongoDB",
        "Gmail OAuth2 API"
      ]
    },
    "sourceUrl": "https://github.com/yamneg96/email-helper",
    "embedMode": "live",
    "order": 9,
    "published": true
  }
];

export const stackLayers = [
  {
    "name": "Frontend",
    "color": "#22d3ee",
    "description": "React, Next.js, TypeScript, Vite, TanStack (Router / Query / Table / Virtual), Tailwind CSS, shadcn/ui, Zustand, RHF + Zod",
    "items": [
      "React",
      "Next.js",
      "TypeScript",
      "Vite",
      "Tailwind",
      "TanStack"
    ],
    "order": 0
  },
  {
    "name": "Mobile",
    "color": "#8b5cf6",
    "description": "React Native, Expo, Expo Router, NativeWind, on-device AI (ExecuTorch), OCR (ML Kit), biometrics, EAS",
    "items": [
      "React Native",
      "Expo",
      "NativeWind",
      "ExecuTorch"
    ],
    "order": 1
  },
  {
    "name": "Backend",
    "color": "#3b82f6",
    "description": "Node.js, Express, NestJS, REST, JWT / RBAC / multi-tenant auth, Socket.IO, BullMQ + Redis, Zod",
    "items": [
      "Node.js",
      "Express",
      "NestJS",
      "Socket.IO",
      "BullMQ"
    ],
    "order": 2
  },
  {
    "name": "Data",
    "color": "#34d399",
    "description": "MongoDB / Mongoose, PostgreSQL (Neon, Drizzle, Prisma), Redis",
    "items": [
      "MongoDB",
      "PostgreSQL",
      "Redis"
    ],
    "order": 3
  },
  {
    "name": "AI / ML",
    "color": "#d946ef",
    "description": "Python, scikit-learn, DistilBERT, XGBoost, SHAP, DVC, OpenAI / Gemini / Groq, RAG, OCR",
    "items": [
      "Python",
      "XGBoost",
      "RAG"
    ],
    "order": 4
  },
  {
    "name": "Payments & identity",
    "color": "#fbbf24",
    "description": "Chapa, Stripe, direct-to-bank verification (CBE), OAuth (Google / Instagram / Telegram), Fayda eSignet",
    "items": [
      "Chapa",
      "Stripe",
      "OAuth"
    ],
    "order": 5
  },
  {
    "name": "DevOps & quality",
    "color": "#fb7185",
    "description": "Docker, Nginx, Vercel / Render / Cloudflare Workers, Turborepo / pnpm, CI/CD · Vitest, Jest, Playwright, Storybook, 2FA / TOTP, rate limiting",
    "items": [
      "Docker",
      "Vercel",
      "Playwright",
      "Vitest"
    ],
    "order": 6
  }
];

export const testimonials = [
  {
    "name": "Abenezer Negash",
    "role": "Radiology Technologist",
    "quote": "Collaborating with Yamlak was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project.",
    "avatarUrl": "/pro0.jpg",
    "order": 0
  },
  {
    "name": "Sana Matusala",
    "role": "Developer and Civil Engineer",
    "quote": "Working with Yamlak was a game-changer for our project. His innovative approach and deep understanding of web development made all the difference.",
    "avatarUrl": "/pro1.jpg",
    "order": 1
  },
  {
    "name": "Besukal Getamesay",
    "role": "Electrical Engineer & IT Technologist",
    "quote": "Teaming with Yamlak exceeded my expectations. His professionalism and creativity transformed our ideas into reality.",
    "avatarUrl": "/pro2.jpg",
    "order": 2
  },
  {
    "name": "Samuel Tesfaye",
    "role": "Economist & Architectural Engineer",
    "quote": "Yamlak’s expertise and dedication were invaluable to our project. He not only met our needs but also provided insights that improved our overall strategy.",
    "avatarUrl": "/pro3.jpg",
    "order": 3
  }
];

export const approachSteps = [
  {
    "title": "Architecture & planning",
    "description": "Map the data model, auth boundaries, integrations and scale before writing code. Monorepo or single app, SQL or NoSQL, sync or async: decided here.",
    "color": "#22d3ee",
    "icon": "layers",
    "order": 0
  },
  {
    "title": "Build in vertical slices",
    "description": "Ship interface, API and data for one real workflow at a time, so working software appears early and integration problems surface early.",
    "color": "#8b5cf6",
    "icon": "loop",
    "order": 1
  },
  {
    "title": "Harden for production",
    "description": "Auth and RBAC, validation, rate limiting, error boundaries and monitoring go in before launch, not after an incident.",
    "color": "#d946ef",
    "icon": "shield",
    "order": 2
  },
  {
    "title": "Ship, measure, iterate",
    "description": "Deployed systems get watched. I track what breaks under real usage and iterate on evidence instead of assumptions.",
    "color": "#fbbf24",
    "icon": "flask",
    "order": 3
  }
];
