CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE locale AS ENUM ('es', 'en');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE content_status AS ENUM ('draft', 'review', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE admin_status AS ENUM ('active', 'locked', 'disabled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE project_kind AS ENUM ('production', 'prototype', 'personal', 'concept');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE media_status AS ENUM ('processing', 'ready', 'quarantined', 'trashed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE contact_status AS ENUM ('new', 'read', 'replied', 'archived', 'spam');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE email_status AS ENUM ('pending', 'sent', 'failed', 'dead');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE turnstile_outcome AS ENUM ('success', 'fail', 'error');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS admin_user (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  display_name text NOT NULL,
  status admin_status NOT NULL DEFAULT 'active',
  failed_login_count integer NOT NULL DEFAULT 0 CHECK (failed_login_count >= 0),
  locked_until timestamptz,
  password_changed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_session (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES admin_user(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  csrf_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  idle_expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  ip_prefix_hash text,
  user_agent_summary text
);
CREATE INDEX IF NOT EXISTS admin_session_user_revoked_idx ON admin_session(user_id, revoked_at);
CREATE INDEX IF NOT EXISTS admin_session_expires_idx ON admin_session(expires_at);

CREATE TABLE IF NOT EXISTS project (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status content_status NOT NULL DEFAULT 'draft',
  kind project_kind NOT NULL DEFAULT 'personal',
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  metric_value text,
  metric_label_key text,
  repo_url text,
  live_url text,
  evidence_note text,
  published_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS project_public_idx ON project(status, published_at, sort_order) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS project_featured_idx ON project(featured, sort_order) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS project_translation (
  project_id uuid NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  locale locale NOT NULL,
  slug text NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  category text NOT NULL,
  role text,
  body jsonb,
  seo_title text,
  seo_description text,
  PRIMARY KEY (project_id, locale)
);
CREATE UNIQUE INDEX IF NOT EXISTS project_translation_locale_slug_idx ON project_translation(locale, slug);

CREATE TABLE IF NOT EXISTS case_study (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status content_status NOT NULL DEFAULT 'draft',
  sort_order integer NOT NULL DEFAULT 0,
  read_time_minutes integer NOT NULL DEFAULT 6 CHECK (read_time_minutes > 0),
  cover_media_id uuid,
  result_value text,
  result_verified boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS case_public_idx ON case_study(status, published_at, sort_order) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS case_translation (
  case_id uuid NOT NULL REFERENCES case_study(id) ON DELETE CASCADE,
  locale locale NOT NULL,
  slug text NOT NULL,
  title text NOT NULL,
  dek text NOT NULL,
  category text NOT NULL,
  period_label text,
  result_label text,
  content_blocks jsonb NOT NULL,
  seo_title text,
  seo_description text,
  PRIMARY KEY (case_id, locale)
);
CREATE UNIQUE INDEX IF NOT EXISTS case_translation_locale_slug_idx ON case_translation(locale, slug);

CREATE TABLE IF NOT EXISTS technology (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label text NOT NULL,
  category text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS project_technology (
  project_id uuid NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  technology_id uuid NOT NULL REFERENCES technology(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, technology_id)
);

CREATE TABLE IF NOT EXISTS case_technology (
  case_id uuid NOT NULL REFERENCES case_study(id) ON DELETE CASCADE,
  technology_id uuid NOT NULL REFERENCES technology(id) ON DELETE CASCADE,
  PRIMARY KEY (case_id, technology_id)
);

CREATE TABLE IF NOT EXISTS media_asset (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_key text NOT NULL UNIQUE,
  original_name_safe text NOT NULL,
  media_type text NOT NULL DEFAULT 'image',
  detected_mime text NOT NULL,
  size_bytes integer NOT NULL,
  width integer NOT NULL,
  height integer NOT NULL,
  sha256 text NOT NULL,
  alt_es text NOT NULL,
  alt_en text NOT NULL,
  caption_es text,
  caption_en text,
  status media_status NOT NULL DEFAULT 'ready',
  uploaded_by uuid REFERENCES admin_user(id) ON DELETE SET NULL,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_message (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_hash text NOT NULL UNIQUE,
  name text NOT NULL,
  email_normalized text NOT NULL,
  company_role text,
  scope text NOT NULL,
  budget text NOT NULL,
  message text NOT NULL,
  locale locale NOT NULL DEFAULT 'es',
  consent_at timestamptz NOT NULL,
  status contact_status NOT NULL DEFAULT 'new',
  turnstile_outcome turnstile_outcome NOT NULL,
  source_ip_hash text,
  retention_until timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS contact_status_created_idx ON contact_message(status, created_at DESC);
CREATE INDEX IF NOT EXISTS contact_retention_idx ON contact_message(retention_until);

CREATE TABLE IF NOT EXISTS email_delivery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_message_id uuid NOT NULL REFERENCES contact_message(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'contact_notification',
  status email_status NOT NULL DEFAULT 'pending',
  attempt_count integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  last_error_code text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS email_queue_idx ON email_delivery(status, next_attempt_at);

CREATE TABLE IF NOT EXISTS content_entry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  schema_version integer NOT NULL DEFAULT 1,
  status content_status NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content_translation (
  entry_id uuid NOT NULL REFERENCES content_entry(id) ON DELETE CASCADE,
  locale locale NOT NULL,
  payload jsonb NOT NULL,
  PRIMARY KEY (entry_id, locale)
);

CREATE TABLE IF NOT EXISTS site_setting (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS slug_redirect (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  locale locale NOT NULL,
  old_slug text NOT NULL,
  new_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS slug_redirect_locale_entity_old_idx ON slug_redirect(locale, entity_type, old_slug);

CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES admin_user(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  result text NOT NULL,
  request_id text NOT NULL,
  changes_redacted jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_created_idx ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS audit_entity_idx ON audit_log(entity_type, entity_id);

CREATE TABLE IF NOT EXISTS rate_limit (
  key text PRIMARY KEY,
  bucket text NOT NULL,
  count integer NOT NULL DEFAULT 0,
  reset_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS rate_limit_reset_idx ON rate_limit(reset_at);
