import { pgTable, serial, text, integer, uuid, date, boolean } from 'drizzle-orm/pg-core';

export const user = pgTable("user", {
	id: uuid("id").primaryKey(),
	canSell: boolean("canSell").notNull().default(false),
});

export const product = pgTable("product", {
	id: uuid("id").primaryKey(),
	sellerUserId: uuid("sellerUserId").notNull().references(() => user.id),
	title: text("title").notNull(),
	description: text("description").notNull(),
});

export const livestream = pgTable("livestream", {
	callId: uuid("livestream").primaryKey(),
	hostUserId: uuid("hostUserId").notNull().unique().references(() => user.id),
	hostSessionId: uuid("hostSessionId"),
	active: boolean("active").notNull().default(true),
});
