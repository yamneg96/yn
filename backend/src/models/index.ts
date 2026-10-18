import { Schema, model, models, type Model } from "mongoose";

function define<T = any>(name: string, schema: Schema): Model<T> {
  return (models[name] as Model<T>) || model<T>(name, schema);
}

export const PROJECT_CATEGORIES = ["fintech", "health", "edtech", "market", "ai", "mobile"] as const;
export const PROJECT_ART = ["pulse", "hex", "graph", "stars", "tags", "bars"] as const;
export const MESSAGE_TOPICS = ["project", "job", "collab", "other"] as const;
export const MESSAGE_STATUSES = ["new", "read", "archived"] as const;
export const APPROACH_ICONS = ["layers", "loop", "shield", "flask"] as const;

const MetricSchema = new Schema(
  { value: { type: Number, required: true }, suffix: { type: String, default: "" }, label: { type: String, required: true } },
  { _id: false }
);

export const AdminUser = define(
  "AdminUser",
  new Schema(
    {
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      passwordHash: { type: String, required: true },
    },
    { timestamps: true }
  )
);

/** One document: everything that isn't a list on the home page. */
export const SiteSettings = define(
  "SiteSettings",
  new Schema(
    {
      fullName: { type: String, default: "Yamlak Negash" },
      initials: { type: String, default: "YN" },
      location: { type: String, default: "Addis Ababa" },
      coordinates: { type: String, default: "9.03°N 38.74°E" },
      timezone: { type: String, default: "Africa/Addis_Ababa" },
      timezoneLabel: { type: String, default: "EAT" },
      availability: { type: String, default: "Open to new opportunities" },
      available: { type: Boolean, default: true },

      heroTitle: { type: String, required: true },
      /** The part of heroTitle drawn with the aurora gradient. */
      heroHighlight: { type: String, default: "" },
      heroRoles: { type: [String], default: [] },
      heroSubtitle: { type: String, required: true },
      heroImageUrl: { type: String },
      resumeUrl: { type: String },
      stats: { type: [MetricSchema], default: [] },

      email: { type: String },
      phone: { type: String },

      aboutHeading: { type: String, default: "" },
      aboutIntro: { type: String, default: "" },
      principle: { type: String, default: "" },
      principleTags: { type: [String], default: [] },
      dailyStack: { type: [String], default: [] },
      timezoneNote: { type: String, default: "" },
      learningNote: { type: String, default: "" },
      insideScoop: { type: String, default: "" },
      scoopRole: { type: String, default: "" },
      scoopSince: { type: String, default: "" },
      ctaHeading: { type: String, default: "" },

      contactHeading: { type: String, default: "" },
      contactHighlight: { type: String, default: "" },
      contactIntro: { type: String, default: "" },

      educationSchool: { type: String, default: "" },
      educationDegree: { type: String, default: "" },
      languages: { type: String, default: "" },
    },
    { timestamps: true }
  )
);

export const Project = define(
  "Project",
  new Schema(
    {
      slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
      title: { type: String, required: true },
      name: { type: String, required: true },
      summary: { type: String, required: true },
      kind: { type: String, default: "Web" },
      role: { type: String, default: "" },
      categories: { type: [String], enum: PROJECT_CATEGORIES, default: [] },

      accent: { type: String, default: "#22d3ee" },
      accent2: { type: String, default: "#6366f1" },
      art: { type: String, enum: PROJECT_ART, default: "graph" },
      coverImageUrl: { type: String },
      featured: { type: Boolean, default: false },

      overview: { type: String, default: "" },
      challenge: { type: String, default: "" },
      solution: { type: String, default: "" },
      outcome: { type: String },
      features: { type: [String], default: [] },
      stack: { type: [String], default: [] },
      metrics: { type: [MetricSchema], default: [] },
      arch: {
        type: new Schema(
          { clients: { type: [String], default: [] }, api: { type: String, default: "" }, back: { type: [String], default: [] } },
          { _id: false }
        ),
        default: () => ({ clients: [], api: "", back: [] }),
      },

      liveUrl: { type: String },
      sourceUrl: { type: String },
      adminUrl: { type: String },
      mobileUrl: { type: String },
      /** live = show the site in the case file's browser; blocked/down = show an explanatory fallback. */
      embedMode: { type: String, enum: ["live", "blocked", "down"], default: "live" },
      embedNote: { type: String },

      order: { type: Number, default: 0 },
      published: { type: Boolean, default: true },
    },
    { timestamps: true }
  )
);

export const ExperienceItem = define(
  "ExperienceItem",
  new Schema(
    {
      title: { type: String, required: true },
      company: { type: String, default: "" },
      period: { type: String, default: "" },
      description: { type: String, required: true },
      tags: { type: [String], default: [] },
      order: { type: Number, default: 0 },
      published: { type: Boolean, default: true },
    },
    { timestamps: true }
  )
);

export const ApproachStep = define(
  "ApproachStep",
  new Schema(
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      icon: { type: String, enum: APPROACH_ICONS, default: "layers" },
      color: { type: String, default: "#22d3ee" },
      order: { type: Number, default: 0 },
    },
    { timestamps: true }
  )
);

/** A row in the Stack section: a layer name, its colour, a description and the technologies in it. */
export const StackLayer = define(
  "StackLayer",
  new Schema(
    {
      name: { type: String, required: true },
      color: { type: String, default: "#22d3ee" },
      description: { type: String, default: "" },
      items: { type: [String], default: [] },
      order: { type: Number, default: 0 },
    },
    { timestamps: true }
  )
);

export const Testimonial = define(
  "Testimonial",
  new Schema(
    {
      name: { type: String, required: true },
      role: { type: String },
      quote: { type: String, required: true },
      avatarUrl: { type: String },
      order: { type: Number, default: 0 },
    },
    { timestamps: true }
  )
);

export const SocialLink = define(
  "SocialLink",
  new Schema(
    {
      platform: { type: String, required: true },
      url: { type: String, required: true },
      note: { type: String },
      iconUrl: { type: String },
      order: { type: Number, default: 0 },
    },
    { timestamps: true }
  )
);

/** A request sent from the portfolio's contact form. */
export const Message = define(
  "Message",
  new Schema(
    {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      topic: { type: String, enum: MESSAGE_TOPICS, default: "project" },
      message: { type: String, required: true },
      status: { type: String, enum: MESSAGE_STATUSES, default: "new", index: true },
      readAt: { type: Date },
      ipHash: { type: String },
      userAgent: { type: String },
    },
    { timestamps: true }
  )
);
