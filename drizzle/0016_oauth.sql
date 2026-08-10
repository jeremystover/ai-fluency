CREATE TABLE `fd_oauth_client` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`redirect_uris` text NOT NULL,
	`secret_hash` text,
	`token_endpoint_auth_method` text NOT NULL,
	`metadata_json` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `fd_oauth_code` (
	`code_hash` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`session_id` text NOT NULL,
	`redirect_uri` text NOT NULL,
	`code_challenge` text NOT NULL,
	`code_challenge_method` text NOT NULL,
	`scope` text,
	`resource` text,
	`expires_at` text NOT NULL,
	`used_at` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_oauth_code_session` ON `fd_oauth_code` (`session_id`);
--> statement-breakpoint
CREATE TABLE `fd_oauth_token` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`client_id` text NOT NULL,
	`session_id` text NOT NULL,
	`scope` text,
	`resource` text,
	`expires_at` text NOT NULL,
	`revoked_at` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_oauth_token_session` ON `fd_oauth_token` (`session_id`,`kind`);
