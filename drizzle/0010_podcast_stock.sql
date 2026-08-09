CREATE TABLE `fd_podcast_stock` (
	`id` text PRIMARY KEY NOT NULL,
	`module_id` text NOT NULL,
	`variant` text NOT NULL,
	`beats_json` text NOT NULL,
	`intro_json` text NOT NULL,
	`body_json` text,
	`outline_json` text,
	`takeaways_json` text,
	`visual_json` text,
	`intro_audio_key` text,
	`title` text,
	`description` text,
	`model_used` text,
	`prompt_version` text,
	`content_reviewed_at` text,
	`baked_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_podcast_stock_module` ON `fd_podcast_stock` (`module_id`,`variant`);
--> statement-breakpoint
CREATE TABLE `fd_podcast_intro` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`module_id` text NOT NULL,
	`intro_json` text NOT NULL,
	`audio_key` text,
	`prompt_version` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_podcast_intro_session` ON `fd_podcast_intro` (`session_id`,`module_id`);
--> statement-breakpoint
ALTER TABLE `fd_podcast` ADD COLUMN `intro_json` text;
--> statement-breakpoint
ALTER TABLE `fd_podcast` ADD COLUMN `intro_audio_key` text;
--> statement-breakpoint
ALTER TABLE `fd_podcast` ADD COLUMN `intro_source` text;
