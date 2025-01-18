import { StreamClient } from "@stream-io/node-sdk";

import { STREAM_SECRET } from "$env/static/private";
import { PUBLIC_STREAM_API_KEY } from "$env/static/public";

export const client = new StreamClient(PUBLIC_STREAM_API_KEY, STREAM_SECRET);

export const callHostUserIds = new Map<string, string>();
export const callHostSessionIds = new Map<string, string>();
