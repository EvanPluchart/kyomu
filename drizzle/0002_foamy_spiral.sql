CREATE TABLE `profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`color` text DEFAULT '#e8a030' NOT NULL,
	`pin` text,
	`theme` text DEFAULT 'dark' NOT NULL,
	`accent` text DEFAULT 'Ambre' NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
DROP INDEX `reading_progress_comic_id_unique`;--> statement-breakpoint
DROP INDEX `idx_reading_progress_comic_id`;--> statement-breakpoint
ALTER TABLE `reading_progress` ADD `profile_id` integer REFERENCES profiles(id);--> statement-breakpoint
CREATE INDEX `idx_progress_comic_profile` ON `reading_progress` (`comic_id`,`profile_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_progress_comic_profile` ON `reading_progress` (`comic_id`,`profile_id`);