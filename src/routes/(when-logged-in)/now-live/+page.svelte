<script lang="ts">
    import NowLive from "$/stories/NowLive.svelte";


let joinCallId = $state("");
</script>

<NowLive />
<!-- 
<button
    onclick={() => goto("/backstage")}
    disabled={store.user === null}
>
    Start a call
</button>

<button
    onclick={() => goto(`/watch?call_id=${encodeURIComponent(joinCallId)}`)}
    disabled={store.user === null}
>
    Join call
</button>

<input
    type="text"
    bind:value={joinCallId}
/> -->