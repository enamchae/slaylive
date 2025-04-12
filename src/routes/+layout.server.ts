import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
    const { session } = await safeGetSession();
    return {
        session,
        cookies: cookies.getAll(),
        BUILD_TYPE: process.env.BUILD_TYPE,
    };
}