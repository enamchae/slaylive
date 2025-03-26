<script lang="ts">
import { goto } from "$app/navigation";

import {store} from "$routes/store.svelte";

</script>

<tabs-rack>
    <div>
        <button onclick={() => goto("/now-live")}>Now live</button>
    </div>

    <div>
        <button onclick={() => goto("/browse")}>Browse</button>
    </div>
    
    {#if store.isSeller}
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
    color: #000;

    z-index: 1;


    > * {
        flex-basis: 0;
        flex-grow: 1;
        
        display: flex;
        justify-content: center;
    }
}

</style>