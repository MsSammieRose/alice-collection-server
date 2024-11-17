CREATE TABLE `posts` (
	`id` integer PRIMARY KEY NOT NULL,
	`year` text NOT NULL,
	`publisher` text NOT NULL,
	`printed_country` text NOT NULL,
	`illustrator` text NOT NULL,
	`ISBN` text NOT NULL,
	`price` text NOT NULL,
	`purchased` text NOT NULL,
	`condition` text NOT NULL,
	`fact` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
