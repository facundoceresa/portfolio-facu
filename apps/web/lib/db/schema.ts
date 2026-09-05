import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const localeEnum = pgEnum("locale", ["es", "en"]);
export const contentStatusEnum = pgEnum("content_status", ["draft", "review", "published", "archived"]);
export const adminStatusEnum = pgEnum("admin_status", ["active", "locked", "disabled"]);
export const projectKindEnum = pgEnum("project_kind", ["production", "prototype", "personal", "concept"]);
export const mediaStatusEnum = pgEnum("media_status", ["processing", "ready", "quarantined", "trashed"]);
export const contactStatusEnum = pgEnum("contact_status", ["new", "read", "replied", "archived", "spam"]);
export const emailStatusEnum = pgEnum("email_status", ["pending", "sent", "failed", "dead"]);
export const turnstileOutcomeEnum = pgEnum("turnstile_outcome", ["success", "fail", "error"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const adminUsers = pgTable("admin_user", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  status: adminStatusEnum("status").notNull().default("active"),
  failedLoginCount: integer("failed_login_count").notNull().default(0),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  passwordChangedAt: timestamp("password_changed_at", { withTimezone: true }).defaultNow().notNull(),
  ...timestamps,
});

export const adminSessions = pgTable("admin_session", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  csrfHash: text("csrf_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  idleExpiresAt: timestamp("idle_expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  ipPrefixHash: text("ip_prefix_hash"),
  userAgentSummary: text("user_agent_summary"),
});

export const projects = pgTable("project", {
  id: uuid("id").primaryKey().defaultRandom(),
  status: contentStatusEnum("status").notNull().default("draft"),
  kind: projectKindEnum("kind").notNull().default("personal"),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  metricValue: text("metric_value"),
  metricLabelKey: text("metric_label_key"),
  repoUrl: text("repo_url"),
  liveUrl: text("live_url"),
  evidenceNote: text("evidence_note"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  ...timestamps,
});

export const projectTranslations = pgTable(
  "project_translation",
  {
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    locale: localeEnum("locale").notNull(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    category: text("category").notNull(),
    role: text("role"),
    body: jsonb("body"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.projectId, table.locale] }),
    slugLocale: uniqueIndex("project_translation_locale_slug_idx").on(table.locale, table.slug),
  }),
);

export const caseStudies = pgTable("case_study", {
  id: uuid("id").primaryKey().defaultRandom(),
  status: contentStatusEnum("status").notNull().default("draft"),
  sortOrder: integer("sort_order").notNull().default(0),
  readTimeMinutes: integer("read_time_minutes").notNull().default(6),
  coverMediaId: uuid("cover_media_id"),
  resultValue: text("result_value"),
  resultVerified: boolean("result_verified").notNull().default(false),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  ...timestamps,
});

export const caseTranslations = pgTable(
  "case_translation",
  {
    caseId: uuid("case_id").notNull().references(() => caseStudies.id, { onDelete: "cascade" }),
    locale: localeEnum("locale").notNull(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    dek: text("dek").notNull(),
    category: text("category").notNull(),
    periodLabel: text("period_label"),
    resultLabel: text("result_label"),
    contentBlocks: jsonb("content_blocks").notNull(),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.caseId, table.locale] }),
    slugLocale: uniqueIndex("case_translation_locale_slug_idx").on(table.locale, table.slug),
  }),
);

export const technologies = pgTable("technology", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  label: text("label").notNull(),
  category: text("category").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export const projectTechnologies = pgTable("project_technology", {
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  technologyId: uuid("technology_id").notNull().references(() => technologies.id, { onDelete: "cascade" }),
}, (table) => ({ pk: primaryKey({ columns: [table.projectId, table.technologyId] }) }));

export const caseTechnologies = pgTable("case_technology", {
  caseId: uuid("case_id").notNull().references(() => caseStudies.id, { onDelete: "cascade" }),
  technologyId: uuid("technology_id").notNull().references(() => technologies.id, { onDelete: "cascade" }),
}, (table) => ({ pk: primaryKey({ columns: [table.caseId, table.technologyId] }) }));

export const mediaAssets = pgTable("media_asset", {
  id: uuid("id").primaryKey().defaultRandom(),
  storageKey: text("storage_key").notNull().unique(),
  originalNameSafe: text("original_name_safe").notNull(),
  mediaType: text("media_type").notNull().default("image"),
  detectedMime: text("detected_mime").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  sha256: text("sha256").notNull(),
  altEs: text("alt_es").notNull(),
  altEn: text("alt_en").notNull(),
  captionEs: text("caption_es"),
  captionEn: text("caption_en"),
  status: mediaStatusEnum("status").notNull().default("ready"),
  uploadedBy: uuid("uploaded_by").references(() => adminUsers.id, { onDelete: "set null" }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  ...timestamps,
});

export const contactMessages = pgTable("contact_message", {
  id: uuid("id").primaryKey().defaultRandom(),
  idempotencyHash: text("idempotency_hash").notNull().unique(),
  name: text("name").notNull(),
  emailNormalized: text("email_normalized").notNull(),
  companyRole: text("company_role"),
  scope: text("scope").notNull(),
  budget: text("budget").notNull(),
  message: text("message").notNull(),
  locale: localeEnum("locale").notNull().default("es"),
  consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
  status: contactStatusEnum("status").notNull().default("new"),
  turnstileOutcome: turnstileOutcomeEnum("turnstile_outcome").notNull(),
  sourceIpHash: text("source_ip_hash"),
  retentionUntil: timestamp("retention_until", { withTimezone: true }).notNull(),
  ...timestamps,
});

export const emailDeliveries = pgTable("email_delivery", {
  id: uuid("id").primaryKey().defaultRandom(),
  contactMessageId: uuid("contact_message_id").notNull().references(() => contactMessages.id, { onDelete: "cascade" }),
  kind: text("kind").notNull().default("contact_notification"),
  status: emailStatusEnum("status").notNull().default("pending"),
  attemptCount: integer("attempt_count").notNull().default(0),
  nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true }).defaultNow().notNull(),
  lastErrorCode: text("last_error_code"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  ...timestamps,
});

export const contentEntries = pgTable("content_entry", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  schemaVersion: integer("schema_version").notNull().default(1),
  status: contentStatusEnum("status").notNull().default("draft"),
  ...timestamps,
});

export const contentTranslations = pgTable("content_translation", {
  entryId: uuid("entry_id").notNull().references(() => contentEntries.id, { onDelete: "cascade" }),
  locale: localeEnum("locale").notNull(),
  payload: jsonb("payload").notNull(),
}, (table) => ({ pk: primaryKey({ columns: [table.entryId, table.locale] }) }));

export const siteSettings = pgTable("site_setting", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const slugRedirects = pgTable("slug_redirect", {
  id: uuid("id").primaryKey().defaultRandom(),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id").notNull(),
  locale: localeEnum("locale").notNull(),
  oldSlug: text("old_slug").notNull(),
  newSlug: text("new_slug").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({ uniqueOld: uniqueIndex("slug_redirect_locale_entity_old_idx").on(table.locale, table.entityType, table.oldSlug) }));

export const auditLogs = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorUserId: uuid("actor_user_id").references(() => adminUsers.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  result: text("result").notNull(),
  requestId: text("request_id").notNull(),
  changesRedacted: jsonb("changes_redacted"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const rateLimits = pgTable("rate_limit", {
  key: text("key").primaryKey(),
  bucket: text("bucket").notNull(),
  count: integer("count").notNull().default(0),
  resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
