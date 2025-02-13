import { pgTable, serial, text, integer, uuid, date, boolean, primaryKey } from 'drizzle-orm/pg-core';

export const user = pgTable("user", {
	id: uuid("id").primaryKey(),
	canSell: boolean("canSell").notNull().default(false),
});

export const listing = pgTable("listing", {
	id: uuid("id").primaryKey(),
	sellerUserId: uuid("sellerUserId").notNull().references(() => user.id),
	title: text("title").notNull(),
	description: text("description").notNull(),
	onDisplay: boolean("onDisplay").notNull().default(false),
});

export const listingImage = pgTable("listingImage", {
	id: uuid("id").primaryKey(),
	listingId: uuid("listingId").notNull().references(() => listing.id),
});

export const livestream = pgTable("livestream", {
	callId: uuid("callId").primaryKey(),
	hostUserId: uuid("hostUserId").notNull().references(() => user.id),
	hostSessionId: uuid("hostSessionId"),
	active: boolean("active").notNull().default(true),
});

export const livestreamListingAssociation = pgTable("livestreamListingAssociation", {
	listingId: uuid("listingId").references(() => listing.id),
	livestreamId: uuid("livestream").references(() => livestream.callId),
}, table => [
	primaryKey({columns: [table.listingId, table.livestreamId]}),
]);