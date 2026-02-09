CREATE TABLE `settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`reminders_enabled` integer DEFAULT true NOT NULL,
	`reminder_interval_minutes` integer DEFAULT 30 NOT NULL,
	CONSTRAINT "settings_singleton_check" CHECK("settings"."id" = 1)
);
