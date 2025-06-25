import { pgTable, serial, text, integer, uuid, date, boolean, primaryKey, decimal, type PgTableExtraConfig, varchar } from 'drizzle-orm/pg-core';

export const userTable = pgTable("user", {
	id: uuid().primaryKey(),
	name: varchar({length: 64}),
	canSell: boolean().notNull().default(false),
	finishedProfileSetup: boolean().notNull().default(false),
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

export const streamTable = pgTable("stream", {
	id: uuid().primaryKey(),
	hostUserId: uuid().notNull().references(() => userTable.id),
	hostSessionId: uuid(),
	active: boolean().notNull().default(false),
	title: varchar("title", {length: 1024}).notNull().default(""),
	description: varchar("description", {length: 4096}).notNull().default(""),
});

export const streamListingAssociationTable = pgTable("streamListingAssociation", {
	listingId: uuid().notNull().references(() => listingTable.id),
	streamId: uuid().notNull().references(() => streamTable.id),
	price: decimal().notNull().default("0"),
	active: boolean().notNull().default(false),
}, table => [
	primaryKey({columns: [table.listingId, table.streamId]}),
]);

export const listingPurchaseTable = pgTable("listingPurchase", {
	purchaseId: uuid().notNull().primaryKey(),
	listingId: uuid().notNull().references(() => listingTable.id),
	streamId: uuid().notNull().references(() => streamTable.id),
	cost: decimal().notNull().default("0"),
	buyerUserId: uuid().notNull().references(() => userTable.id),
});