CREATE TABLE `fd_podcast` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`module_id` text NOT NULL,
	`prompt_text` text,
	`length_pref` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`script_json` text NOT NULL,
	`total_chars` integer NOT NULL,
	`model_used` text,
	`prompt_version` text,
	`voice_a` text NOT NULL,
	`voice_b` text NOT NULL,
	`audio_key` text,
	`audio_bytes` integer,
	`audio_at` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_podcast_session` ON `fd_podcast` (`session_id`);
