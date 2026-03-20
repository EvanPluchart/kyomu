CREATE TABLE `app_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `comics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`series_id` integer NOT NULL,
	`title` text NOT NULL,
	`number` real,
	`file_path` text NOT NULL,
	`file_size` integer NOT NULL,
	`file_mtime` integer NOT NULL,
	`format` text NOT NULL,
	`page_count` integer,
	`metadata_json` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`series_id`) REFERENCES `series`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `comics_file_path_unique` ON `comics` (`file_path`);--> statement-breakpoint
CREATE INDEX `idx_comics_series_id` ON `comics` (`series_id`);--> statement-breakpoint
CREATE INDEX `idx_comics_file_path` ON `comics` (`file_path`);--> statement-breakpoint
CREATE INDEX `idx_comics_title` ON `comics` (`title`);--> statement-breakpoint
CREATE TABLE `reading_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`comic_id` integer NOT NULL,
	`current_page` integer DEFAULT 0 NOT NULL,
	`total_pages` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'unread' NOT NULL,
	`started_at` text,
	`completed_at` text,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`comic_id`) REFERENCES `comics`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reading_progress_comic_id_unique` ON `reading_progress` (`comic_id`);--> statement-breakpoint
CREATE INDEX `idx_reading_progress_comic_id` ON `reading_progress` (`comic_id`);--> statement-breakpoint
CREATE TABLE `series` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`author` text,
	`publisher` text,
	`year` integer,
	`comics_count` integer DEFAULT 0,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `series_slug_unique` ON `series` (`slug`);