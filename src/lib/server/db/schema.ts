import { pgTable, serial, text, integer, uuid, date } from 'drizzle-orm/pg-core';

export const livestream = pgTable("livestream", {
	callId: uuid("livestream").primaryKey(),
	hostUserId: uuid("hostUserId").notNull().unique(),
	hostSessionId: uuid("hostSessionId"),
});
