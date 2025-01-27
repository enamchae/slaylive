<script lang="ts">
import Backstage from "$stories/Backstage.svelte";

import {store} from "$routes/store.svelte";
</script>

{#if store.user !== null}
    <Backstage
        userToken={store.user.streamioAuth.token}
        userId={store.user.streamioAuth.id}
        userName={store.user.streamioAuth.name}
    />
{/if}