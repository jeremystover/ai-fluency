CREATE TABLE `fd_account` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_slug` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL,
	`last_login_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_account_email` ON `fd_account` (`brand_slug`,`email`);
--> statement-breakpoint
ALTER TABLE `fd_session` ADD `account_id` text;
