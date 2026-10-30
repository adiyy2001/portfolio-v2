CREATE TABLE IF NOT EXISTS scans (
  id TEXT PRIMARY KEY,
  at TEXT NOT NULL,
  lang TEXT NOT NULL,
  url TEXT NOT NULL,
  domain TEXT NOT NULL,
  email TEXT NOT NULL,
  email_key TEXT NOT NULL DEFAULT '',
  ip_hash TEXT NOT NULL,
  ua TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  confirm_token_hash TEXT NOT NULL,
  unsubscribe_token_hash TEXT NOT NULL,
  confirmed_at TEXT,
  started_at TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  report_key TEXT,
  report_bytes INTEGER,
  report_expires TEXT,
  summary_json TEXT,
  error TEXT,
  marketing INTEGER NOT NULL DEFAULT 0,
  unsubscribed_at TEXT,
  page TEXT NOT NULL DEFAULT '',
  sequence_step INTEGER NOT NULL DEFAULT 0,
  sequence_sent_at TEXT
);
CREATE INDEX IF NOT EXISTS scans_domain_at ON scans (domain, at);
CREATE INDEX IF NOT EXISTS scans_ip_at ON scans (ip_hash, at);
CREATE INDEX IF NOT EXISTS scans_email_at ON scans (email_key, at);
CREATE INDEX IF NOT EXISTS scans_status ON scans (status, confirmed_at);
CREATE INDEX IF NOT EXISTS scans_report_bytes ON scans (report_bytes) WHERE report_key IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS scans_confirm_token ON scans (confirm_token_hash);
CREATE UNIQUE INDEX IF NOT EXISTS scans_unsubscribe_token ON scans (unsubscribe_token_hash);

CREATE TABLE IF NOT EXISTS consents (
  id TEXT PRIMARY KEY,
  scan_id TEXT NOT NULL,
  at TEXT NOT NULL,
  kind TEXT NOT NULL,
  version TEXT NOT NULL,
  text TEXT NOT NULL,
  text_sha256 TEXT NOT NULL,
  granted INTEGER NOT NULL,
  ip TEXT NOT NULL DEFAULT '',
  ua TEXT NOT NULL DEFAULT '',
  page TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS consents_scan ON consents (scan_id);

CREATE TABLE IF NOT EXISTS usage (
  day TEXT NOT NULL,
  metric TEXT NOT NULL,
  value INTEGER NOT NULL,
  PRIMARY KEY (day, metric)
) WITHOUT ROWID;
