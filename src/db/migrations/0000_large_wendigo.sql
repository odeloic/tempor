CREATE TABLE `projects` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`client` text,
	`color` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`last_used_at` integer
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` integer PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`date` integer NOT NULL,
	`duration` integer NOT NULL,
	`note` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `timer_state` (
	`id` integer PRIMARY KEY NOT NULL,
	`project_id` text,
	`status` text DEFAULT 'idle' NOT NULL,
	`accumulated_seconds` integer DEFAULT 0 NOT NULL,
	`last_resumed_at` integer,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "timer_state_singleton_check" CHECK("timer_state"."id" = 1)
);
