import { pgTable, serial, text, integer, uuid, date, boolean, primaryKey, decimal, type PgTableExtraConfig, varchar } from 'drizzle-orm/pg-core';

export const userTable = pgTable("user", {
	id: uuid().primaryKey(),
	name: varchar({length: 64}),
	canSell: boolean().notNull().default(false),
	stripeCustomerId: varchar({length: 255}),
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
	stripePaymentIntentId: varchar({length: 255}),
	paymentStatus: varchar({length: 50}).notNull().default("pending"),
	createdAt: date().notNull().defaultNow(),
});

export const paymentMethodTable = pgTable("paymentMethod", {
	id: uuid().primaryKey(),
	userId: uuid().notNull().references(() => userTable.id),
	stripePaymentMethodId: varchar({length: 255}).notNull(),
	type: varchar({length: 50}).notNull(), // 'card', 'bank_account', etc.
	cardBrand: varchar({length: 50}), // 'visa', 'mastercard', etc.
	cardLast4: varchar({length: 4}),
	cardExpMonth: integer(),
	cardExpYear: integer(),
	isDefault: boolean().notNull().default(false),
	createdAt: date().notNull().defaultNow(),
});