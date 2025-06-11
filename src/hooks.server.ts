import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import {corsHandle} from "$lib/cors";
import {handle as supabaseHandle} from "$lib/supabase";

export const handle: Handle = sequence(corsHandle, supabaseHandle);
