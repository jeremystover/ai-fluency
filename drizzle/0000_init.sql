CREATE TABLE `fd_access_code` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_slug` text NOT NULL,
	`code_hash` text NOT NULL,
	`label` text NOT NULL,
	`max_uses` integer,
	`uses` integer DEFAULT 0 NOT NULL,
	`expires_at` text,
	`active` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `fd_brand` (
	`slug` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`tokens_json` text NOT NULL,
	`voice_json` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `fd_calibration` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`context` text NOT NULL,
	`predicted_pct` real NOT NULL,
	`actual_outcome` real,
	`delta` real,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_cal_session` ON `fd_calibration` (`session_id`);--> statement-breakpoint
CREATE TABLE `fd_content_block` (
	`id` text PRIMARY KEY NOT NULL,
	`module_id` text NOT NULL,
	`ordinal` integer NOT NULL,
	`kind` text NOT NULL,
	`layer` text NOT NULL,
	`body` text NOT NULL,
	`depends_on` text,
	`reviewed_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_block_module` ON `fd_content_block` (`module_id`,`ordinal`);--> statement-breakpoint
CREATE TABLE `fd_diagnostic_response` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`item_id` text NOT NULL,
	`answer_json` text NOT NULL,
	`correct` integer,
	`ms_elapsed` integer
);
--> statement-breakpoint
CREATE INDEX `idx_diag_session` ON `fd_diagnostic_response` (`session_id`);--> statement-breakpoint
CREATE TABLE `fd_event` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text,
	`type` text NOT NULL,
	`payload_json` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_event_session` ON `fd_event` (`session_id`);--> statement-breakpoint
CREATE INDEX `idx_event_type_time` ON `fd_event` (`type`,`created_at`);--> statement-breakpoint
CREATE TABLE `fd_module` (
	`id` text PRIMARY KEY NOT NULL,
	`course_id` text NOT NULL,
	`ordinal` integer NOT NULL,
	`title` text NOT NULL,
	`blurb` text NOT NULL,
	`status` text NOT NULL,
	`est_minutes` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `fd_participant` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`display_name` text,
	`role_label` text,
	`org_label` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `fd_session` (
	`id` text PRIMARY KEY NOT NULL,
	`code_id` text NOT NULL,
	`brand_slug` text NOT NULL,
	`created_at` text NOT NULL,
	`last_seen_at` text NOT NULL,
	`user_agent` text,
	`ip_hash` text
);
--> statement-breakpoint
CREATE TABLE `fd_submission` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`module_id` text NOT NULL,
	`body` text NOT NULL,
	`rubric_json` text,
	`total_score` integer,
	`model_used` text,
	`prompt_version` text,
	`graded_at` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_sub_session` ON `fd_submission` (`session_id`);