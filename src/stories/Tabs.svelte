<script lang="ts">
import { goto } from "$app/navigation";

import {store} from "$routes/store.svelte";

</script>

<tabs-rack>
    <div>
        <button onclick={() => goto("/listings")}>Browse</button>
    </div>

    <div>
        <button onclick={() => goto("/")}>Live now</button>
    </div>
    
    {#if store.user !== null && store.user.canSell}
        <div>
            <button onclick={() => goto("/seller/dashboard")}>Seller profile</button>
        </div>
    {/if}
</tabs-rack>

<style lang="scss">
tabs-rack {
    display: flex;
    justify-content: space-evenly;
    padding: 1rem;

    background: #fff;

    > * {
        flex-basis: 0;
        flex-grow: 1;
        
        display: flex;
        justify-content: center;
    }
}
</style>