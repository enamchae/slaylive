<script lang="ts">
import { onMount } from "svelte";

let message = $state("");

let messageHistory = $state<{userId: string, message: string}[]>([]);

const clientName = crypto.randomUUID();

let ws: WebSocket | null = null;

onMount(() => {
    ws = new WebSocket(`ws://localhost:8080`);

    ws.addEventListener("open", (event) => {
        console.log("connected");
    });

    ws.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        console.log(data);

        messageHistory.push(data);
    });
});

const sendMessage = () => {
    ws.send(JSON.stringify({
        userId: clientName,
        message,
    }));

    message = "";
};

</script>

{#each messageHistory as message}
    <div>
        {message.userId}: {message.message}
    </div>
{/each}

<input
    type="text"
    bind:value={message}
    on:keydown={event => event.key === "Enter" && sendMessage()}
/>