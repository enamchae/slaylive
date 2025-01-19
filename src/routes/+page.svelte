<script lang="ts">
import Button from "$stories/Button.svelte";

const {data} = $props();
const {supabase} = $derived(data);
</script>

<div>
    <Button
        label="Login with Google"
        onClick={() => supabase.auth.signInWithOAuth({provider: "google"})}
    />
</div>