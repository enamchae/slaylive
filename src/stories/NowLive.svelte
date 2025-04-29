<script lang="ts">
import {onMount} from "svelte";

import { PUBLIC_API_URL } from "$env/static/public";
import ButtonRaised from "./ButtonRaised.svelte";
import { apiFetch } from "$/routes/util";
    import { goto } from "$app/navigation";

const joinCall = (callId: string) => {
    goto(`/watch?call_id=${encodeURIComponent(callId)}`);
};
</script>

<now-live>
    {#await apiFetch("livestream/list")}
        <div>Loading ongoing livestreams</div>
    {:then livestreams}
        {#each livestreams as livestream (livestream.id)}
            <div>
                <ButtonRaised
                    onClick={() => joinCall(livestream.id)}
                    backgroundColor="#fff"
                >
                    abc
                </ButtonRaised>
            </div>
        {/each}
    {:catch error}
        <div>Could not load livestreams: {error}</div>
    {/await}
</now-live>


<style lang="scss">
now-live {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
