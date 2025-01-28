<script lang="ts">
import {onMount} from "svelte";

import { PUBLIC_API_URL } from "$env/static/public";
    import ButtonRaised from "./ButtonRaised.svelte";
    import { apiFetch } from "$/routes/util";

let livestreams = $state<any[]>([]);

onMount(async () => {
    livestreams = await apiFetch("livestream/list");
});

const joinCall = (callId: string) => {

};
</script>

<div>
    {#each livestreams as livestream}
        <div>
            <ButtonRaised
                onClick={() => joinCall(livestream.callId)}
            >
                abc
            </ButtonRaised>
        </div>
    {/each}
</div>

