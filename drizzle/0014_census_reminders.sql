CREATE TABLE `fd_employee` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_slug` text NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`role_title` text,
	`manager_name` text,
	`manager_email` text,
	`level` text,
	`location` text,
	`start_date` text,
	`source` text DEFAULT 'csv' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_employee_brand` ON `fd_employee` (`brand_slug`);
--> statement-breakpoint
CREATE TABLE `fd_reminder_rule` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_slug` text NOT NULL,
	`audience` text NOT NULL,
	`trigger` text NOT NULL,
	`days` integer NOT NULL,
	`template` text NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_reminder_brand` ON `fd_reminder_rule` (`brand_slug`);
