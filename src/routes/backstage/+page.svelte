<script lang="ts">
import Backstage from "$stories/Backstage.svelte";

import {store} from "$routes/store.svelte";
</script>

{#if store.userId !== null && store.userToken !== null && store.userName !== null}
    <Backstage
        userToken={store.userToken}
        userId={store.userId}
        userName={store.userName}
    />
{/if}