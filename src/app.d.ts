// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
        interface Locals {
            supabase: SupabaseClient
            safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
            session: Session | null
            user: User | null
            token: string | null;
        }
        interface PageData {
            session: Session | null
        }
	}
}

export {};
