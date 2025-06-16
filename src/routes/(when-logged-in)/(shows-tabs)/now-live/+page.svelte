<script lang="ts">
    import TitledPage from "../TitledPage.svelte";
    import NowLive from "./NowLive.svelte";
</script>

<TitledPage
    heading="now live"
>
    <NowLive />
</TitledPage>

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