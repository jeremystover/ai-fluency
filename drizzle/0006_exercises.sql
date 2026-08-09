CREATE TABLE `fd_exercise` (
	`id` text PRIMARY KEY NOT NULL,
	`module_id` text NOT NULL,
	`kind` text NOT NULL,
	`payload_json` text NOT NULL,
	`reviewed_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_exercise_module` ON `fd_exercise` (`module_id`,`kind`);