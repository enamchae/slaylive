import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { i18n } from '$lib/i18n';
import {corsHandle} from "$lib/cors";
import {handle as supabaseHandle} from "$lib/supabase";

const handleParaglide: Handle = i18n.handle();
export const handle: Handle = sequence(corsHandle, supabaseHandle, handleParaglide);
