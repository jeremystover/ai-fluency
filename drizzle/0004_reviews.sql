CREATE TABLE `fd_review` (
	`id` text PRIMARY KEY NOT NULL,
	`submission_id` text NOT NULL,
	`reviewer` text NOT NULL,
	`body` text NOT NULL,
	`score` integer,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_review_submission` ON `fd_review` (`submission_id`);