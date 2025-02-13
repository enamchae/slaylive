import type { User } from "@supabase/supabase-js";

export type UserData = Readonly<{
    supabaseUser: User,
    supabaseAccessToken: string,
    streamioAuth: Readonly<{
        id: string,
        name: string,
        token: string,
    }>,
    id: string,
    name: string,
    canSell: boolean,
}>;

export const store = $state({
    user: <UserData | null>null,
    get isSeller() {
        return this.user !== null && this.user.canSell;
    },
});
