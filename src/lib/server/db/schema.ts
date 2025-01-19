import { pgTable, serial, text, integer, uuid, date } from 'drizzle-orm/pg-core';

export const user = pgTable("user", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: date("createdAt").defaultNow().notNull(),
	name: text("name").notNull(),
});
