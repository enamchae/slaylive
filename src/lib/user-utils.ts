import type { userTable } from "./server/db/schema";

export const hasFinishedProfileSetup = (user: Partial<typeof userTable.$inferSelect>) => {
    return user.name !== null && user.stripeCustomerId !== null;
};
