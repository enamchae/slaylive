import { pgTable, serial, text, integer, uuid, date, boolean, primaryKey, decimal, type PgTableExtraConfig, varchar } from 'drizzle-orm/pg-core';

export const userTable = pgTable("user", {
	id: uuid().primaryKey(),
	name: varchar({length: 64}).notNull(),
	canSell: boolean().notNull().default(false),
});

export const listingTable = pgTable("listing", {
	id: uuid().primaryKey(),
	sellerUserId: uuid().notNull().references(() => userTable.id),
	title: varchar("title", {length: 1024}).notNull(),
	description: varchar("description", {length: 4096}).notNull(),
	onDisplay: boolean().notNull().default(false),
});

export const listingImageTable = pgTable("listingImage", {
	id: uuid().primaryKey(),
	listingId: uuid().notNull().references(() => listingTable.id),
});

export const livestreamTable = pgTable("livestream", {
	id: uuid().primaryKey(),
	hostUserId: uuid().notNull().references(() => userTable.id),
	hostSessionId: uuid(),
	active: boolean().notNull().default(false),
	title: varchar("title", {length: 1024}).notNull().default(""),
	description: varchar("description", {length: 4096}).notNull().default(""),
});

export const livestreamListingAssociationTable = pgTable("livestreamListingAssociation", {
	listingId: uuid().notNull().references(() => listingTable.id),
	livestreamId: uuid().notNull().references(() => livestreamTable.id),
	price: decimal().notNull().default("0"),
}, table => [
	primaryKey({columns: [table.listingId, table.livestreamId]}),
]);

export const listingPurchaseTable = pgTable("listingPurchase", {
	purchaseId: uuid().notNull().primaryKey(),
	listingId: uuid().notNull().references(() => listingTable.id),
	livestreamId: uuid().notNull().references(() => livestreamTable.id),
	cost: decimal().notNull().default("0"),
	buyerUserId: uuid().notNull().references(() => userTable.id),
});