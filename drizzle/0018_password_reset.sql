-- Self-serve password reset. One live token per account: requesting a new one
-- invalidates every outstanding token, so a forwarded old mail is dead the
-- moment a second request is made. Tokens are stored as unsalted SHA-256 of
-- 256 bits of randomness (same reasoning as the OAuth tables — the input is
-- already high-entropy, and lookup must be by exact hash), so a database dump
-- never yields a usable link.
CREATE TABLE IF NOT EXISTS fd_password_reset (
  id TEXT PRIMARY KEY,
  brand_slug TEXT NOT NULL,
  account_id TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  ip_hash TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_password_reset_token ON fd_password_reset(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_reset_account ON fd_password_reset(account_id, used_at);
