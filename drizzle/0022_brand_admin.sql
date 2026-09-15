-- A per-brand admin passcode, so a client can be handed the operator console
-- for their own brand without the deployment's master passcode.
--
-- NULL means the brand has no admin of its own — only the master passcode
-- (the ADMIN_PASSCODE secret) opens the console, scoped to the deployment's
-- default brand, exactly as before. Set through PUT /api/import/org when a
-- client is provisioned; stored as the same PBKDF2 shape as access codes.

ALTER TABLE fd_brand ADD COLUMN admin_passcode_hash TEXT;
