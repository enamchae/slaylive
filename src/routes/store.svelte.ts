import type { User } from "@supabase/supabase-js";

export type UserData = {
    supabaseUser: User,
    streamioAuth: {
        id: string,
        name: string,
        token: string,
    },
};

export const store = $state({
    user: <UserData | null>null,
});