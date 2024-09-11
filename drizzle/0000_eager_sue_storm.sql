DROP TABLE IF EXISTS logs;
DROP TABLE IF EXISTS assessments;
DROP TABLE IF EXISTS users;

CREATE TABLE `assessments` (
	`assessment_id` text PRIMARY KEY NOT NULL,
	`uid` text NOT NULL,
	`name` text NOT NULL,
	`transcript` text,
	`filename` text NOT NULL,
	`status` text DEFAULT 'processing',
	`agreeableness` integer DEFAULT 0,
	`conscientiousness` integer DEFAULT 0,
	`extraversion` integer DEFAULT 0,
	`openness` integer DEFAULT 0,
	`neuroticism` integer DEFAULT 0,
	`error` text DEFAULT '',
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `logs` (
	`log_id` text PRIMARY KEY NOT NULL,
	`uid` text NOT NULL,
	`assessment_id` text NOT NULL,
	`event` text NOT NULL,
	`message` text NOT NULL,
	`type` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`uid` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`assessment_id` text,
	`password` text NOT NULL,
	`api_key` text NOT NULL,
	`password_reset` integer DEFAULT true,
	`credit_remaining` integer DEFAULT 0 NOT NULL,
	`api_prices` text DEFAULT '{}' NOT NULL,
	`role` text DEFAULT 'client' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`user_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);

-- password vtDDD40i6Rnb
INSERT INTO users (uid, name, email, password, api_key, role, user_active) VALUES ('h8ftav0cveyn734ht3knkw8v', 'Stu Kennedy', 'stu@getkoios.ai', '+0EpWAr+/kcdyWqEDeR4jln/fbPs4uf8jCYewdKZH+4=', 'e0ui4dkp98koni4loe6n38d6', 'admin', true);
