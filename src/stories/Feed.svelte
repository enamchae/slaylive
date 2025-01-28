<script lang="ts">
import {onMount} from "svelte";

import { PUBLIC_API_URL } from "$env/static/public";
    import Button from "./ButtonRaised.svelte";

let calls = $state<string[]>([]);

onMount(async () => {
    const callIds: string[] = await (await fetch(new URL("/api/livestream/list", PUBLIC_API_URL))).json();

    calls = callIds;
});

const joinCall = (callId: string) => {

};
</script>

<div>
    {#each calls as call}
        <div>
            <Button
                label={call}
                onClick={() => joinCall(call)}
            />
        </div>
    {/each}
</div>

