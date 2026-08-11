CREATE TABLE `fd_email_send` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_slug` text NOT NULL,
	`kind` text NOT NULL,
	`to_email` text NOT NULL,
	`subject` text NOT NULL,
	`body` text NOT NULL,
	`status` text NOT NULL,
	`provider` text,
	`error` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_email_send_dedupe` ON `fd_email_send` (`brand_slug`,`kind`,`to_email`,`created_at`);
--> statement-breakpoint
CREATE TABLE `fd_manager_action` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_slug` text NOT NULL,
	`manager_email` text NOT NULL,
	`employee_id` text NOT NULL,
	`kind` text NOT NULL,
	`module_id` text,
	`due_date` text,
	`body` text NOT NULL,
	`created_at` text NOT NULL,
	`seen_at` text
);
--> statement-breakpoint
CREATE INDEX `idx_manager_action_emp` ON `fd_manager_action` (`employee_id`,`created_at`);
--> statement-breakpoint
CREATE INDEX `idx_manager_action_mgr` ON `fd_manager_action` (`manager_email`);
--> statement-breakpoint
CREATE TABLE `fd_commitment` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_slug` text NOT NULL,
	`session_id` text NOT NULL,
	`course_id` text NOT NULL,
	`target_date` text NOT NULL,
	`note` text,
	`shared_with_manager` integer DEFAULT 0 NOT NULL,
	`manager_ack_at` text,
	`manager_note` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_commitment_session` ON `fd_commitment` (`session_id`,`created_at`);
