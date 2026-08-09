CREATE TABLE `fd_content_snapshot` (
	`hash` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`module_id` text NOT NULL,
	`content_json` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_snapshot_module` ON `fd_content_snapshot` (`module_id`);
--> statement-breakpoint
CREATE TABLE `fd_completion_audit` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`module_id` text NOT NULL,
	`activity` text NOT NULL,
	`ref_id` text,
	`content_hash` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_audit_session` ON `fd_completion_audit` (`session_id`);
--> statement-breakpoint
CREATE INDEX `idx_audit_module` ON `fd_completion_audit` (`module_id`,`activity`);
--> statement-breakpoint
CREATE INDEX `idx_audit_hash` ON `fd_completion_audit` (`content_hash`);
