<script lang="ts">
import { goto } from "$app/navigation";

import {store} from "$routes/store.svelte";
import Tab from "./Tab.svelte";

import nowLiveIcon from "$stories/assets/now-live.svg";
import browseIcon from "$stories/assets/browse.svg";
import profileIcon from "$stories/assets/profile.svg";
    import { page } from "$app/state";

</script>

<tabs-rack>
    <Tab
        onClick={() => goto("/now-live")}
        label="now live"
        icon={nowLiveIcon}
        accent="#FF8DC87f"
        shadowAccent="#E02B743f"
        selected={page.url.pathname === "/now-live"}
    />

    <Tab
        onClick={() => goto("/browse")}
        label="browse"
        icon={browseIcon}
        accent="#B9FF9F7f"
        shadowAccent="#6BFB363f"
        selected={page.url.pathname === "/browse"}
    />
    
    <Tab
        onClick={() => goto("/profile")}
        label="profile"
        icon={profileIcon}
        accent="#A2C2FF7f"
        shadowAccent="#268BFF3f"
        selected={page.url.pathname === "/profile"}
    />
</tabs-rack>

<style lang="scss">
tabs-rack {
    display: flex;
    justify-content: space-evenly;
    padding: 1rem;

    background: #FFD2B83f;
    margin: 0 2rem 4rem;
    border-radius: 0.75rem;

    z-index: 1;


    > * {
        flex-basis: 0;
        flex-grow: 1;
        
        display: flex;
        justify-content: center;
    }
}

</style>