import type { User } from "@supabase/supabase-js";

export type UserData = Readonly<{
    supabaseUser: User,
    supabaseAccessToken: string,
    streamioAuth: Readonly<{
        id: string,
        name: string,
        token: string,
    }>,
}>;

export const store = $state({
    user: <UserData | null>null,
});
