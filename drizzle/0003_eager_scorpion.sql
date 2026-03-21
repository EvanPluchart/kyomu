CREATE TABLE `auth_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`session_token` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `auth_users_username_unique` ON `auth_users` (`username`);