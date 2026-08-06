CREATE TABLE `fd_preference` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`key` text NOT NULL,
	`value_json` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_pref_session` ON `fd_preference` (`session_id`,`key`);