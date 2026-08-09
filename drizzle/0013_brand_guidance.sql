CREATE TABLE `fd_brand_guidance` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_slug` text NOT NULL,
	`scope` text NOT NULL,
	`body` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_guidance_brand` ON `fd_brand_guidance` (`brand_slug`,`scope`);
