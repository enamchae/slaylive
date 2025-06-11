import { pgTable, serial, text, integer, uuid, date, boolean, primaryKey, decimal, type PgTableExtraConfig } from 'drizzle-orm/pg-core';

export const userTable = pgTable("user", {
	id: uuid("id").primaryKey(),
	canSell: boolean("canSell").notNull().default(false),
});

export const listingTable = pgTable("listing", {
	id: uuid("id").primaryKey(),
	sellerUserId: uuid("sellerUserId").notNull().references(() => userTable.id),
	title: text("title").notNull(),
	description: text("description").notNull(),
	onDisplay: boolean("onDisplay").notNull().default(false),
});

export const listingImageTable = pgTable("listingImage", {
	id: uuid("id").primaryKey(),
	listingId: uuid("listingId").notNull().references(() => listingTable.id),
});

export const livestreamTable = pgTable("livestream", {
	id: uuid("id").primaryKey(),
	hostUserId: uuid("hostUserId").notNull().references(() => userTable.id),
	hostSessionId: uuid("hostSessionId"),
	active: boolean("active").notNull().default(false),
	title: text("title").notNull().default(""),
	description: text("description").notNull().default(""),
});

export const livestreamListingAssociationTable = pgTable("livestreamListingAssociation", {
	listingId: uuid("listingId").notNull().references(() => listingTable.id),
	livestreamId: uuid("livestream").notNull().references(() => livestreamTable.id),
	price: decimal("price").notNull().default("0"),
}, table => [
	primaryKey({columns: [table.listingId, table.livestreamId]}),
] as unknown as PgTableExtraConfig);