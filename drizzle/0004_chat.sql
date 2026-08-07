CREATE TABLE `fd_chat_message` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`module_id` text NOT NULL,
	`ordinal` integer NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`model_used` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_chat_session_module` ON `fd_chat_message` (`session_id`,`module_id`,`ordinal`);