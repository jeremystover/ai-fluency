CREATE TABLE `fd_short_course` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_slug` text NOT NULL,
	`label` text NOT NULL,
	`blurb` text,
	`role_id` text,
	`module_ids_json` text NOT NULL,
	`diagnostic_json` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_short_course_brand` ON `fd_short_course` (`brand_slug`);
--> statement-breakpoint
ALTER TABLE `fd_access_code` ADD `short_course_id` text;
