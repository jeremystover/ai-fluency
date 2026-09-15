-- Provenance on the provisioning tables, for the same reason 0020 gave it to
-- the content tables: a second writer now exists.
--
-- The seed rebuilds fd_brand, fd_access_code and fd_short_course from
-- content/ and opened with an unconditional DELETE on each. That was already
-- wrong for access codes created in the operator console (every seed run
-- erased them), and it becomes fatal once the Chief Learning Officer
-- provisions a client — brand, short course and passcode — through
-- PUT /api/import/org: the next seed-content run would silently take the
-- client's course away.
--
-- With this column the seed deletes only WHERE source = 'seed', and the
-- provisioning route writes and replaces only WHERE source = 'import'.
-- Default 'seed' is deliberate: every existing row came from the seed.

ALTER TABLE fd_brand        ADD COLUMN source TEXT NOT NULL DEFAULT 'seed';
ALTER TABLE fd_short_course ADD COLUMN source TEXT NOT NULL DEFAULT 'seed';
ALTER TABLE fd_access_code  ADD COLUMN source TEXT NOT NULL DEFAULT 'seed';
