<script lang="ts">
import { onMount } from "svelte";

onMount(() => {
    const ws = new WebSocket(`ws://localhost:8080`);
    ws.addEventListener("open", (event) => {
        console.log("connected");

        ws.send("ee");
    });
});
</script>