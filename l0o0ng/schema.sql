-- urloong's only table: one row per long link. Created by `npm run db:setup`; safe to run again.
CREATE TABLE IF NOT EXISTS url_mappings (
  hash TEXT PRIMARY KEY,
  original_url TEXT NOT NULL,
  clicks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
