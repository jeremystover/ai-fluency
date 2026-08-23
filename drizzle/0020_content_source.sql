-- Content provenance, so the seed and the importer stop being able to
-- destroy each other's work.
--
-- Until now there was exactly one writer of course content: seed/seed.sql,
-- applied by the seed-content maintenance task, which begins by DELETEing
-- every row in fd_module, fd_content_block and fd_exercise. That is correct
-- for a single generated artifact and fatal the moment a second writer
-- exists.
--
-- The Chief Learning Officer agent is that second writer. Without a
-- provenance mark, publishing a course and then running seed-content would
-- silently erase the published course, and importing a course whose id
-- collided with a hand-authored one would silently erase the hand-authored
-- modules. Both failures are invisible until a learner hits a dead end.
--
-- With this column:
--   * the seed deletes only WHERE source = 'seed'
--   * the importer writes and replaces only WHERE source = 'import'
--   * the importer refuses outright to touch a course that has any
--     source='seed' rows
--
-- Default 'seed' is deliberate: every existing row predates the importer and
-- belongs to the seed, and a NOT NULL default means no backfill pass.

ALTER TABLE fd_module ADD COLUMN source TEXT NOT NULL DEFAULT 'seed';
ALTER TABLE fd_content_block ADD COLUMN source TEXT NOT NULL DEFAULT 'seed';
ALTER TABLE fd_exercise ADD COLUMN source TEXT NOT NULL DEFAULT 'seed';

CREATE INDEX IF NOT EXISTS idx_module_source ON fd_module (source, course_id);
CREATE INDEX IF NOT EXISTS idx_block_source ON fd_content_block (source);
CREATE INDEX IF NOT EXISTS idx_exercise_source ON fd_exercise (source);

-- One row per accepted import. Two jobs: it makes POST /api/import/course
-- idempotent on (course_id, bundle_hash), and it is what
-- GET /api/import/manifest reads so the authoring side can diff before it
-- sends a bundle it does not need to send.
CREATE TABLE IF NOT EXISTS fd_imported_course (
  course_id     TEXT PRIMARY KEY,
  bundle_hash   TEXT NOT NULL,
  cpf_version   TEXT NOT NULL,
  title         TEXT NOT NULL,
  format        TEXT NOT NULL DEFAULT 'course',
  module_count  INTEGER NOT NULL DEFAULT 0,
  imported_at   TEXT NOT NULL
);
