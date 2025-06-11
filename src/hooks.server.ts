import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import {corsHandle} from "$/lib/server/hooks/cors";
import {handle as supabaseHandle} from "$/lib/server/hooks/supabase";

export const handle: Handle = sequence(corsHandle, supabaseHandle);
