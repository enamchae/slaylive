<script lang="ts">
import Chat from "$stories/Chat.svelte";

let video = $state<HTMLVideoElement | null>(null);

const startStream = async () => {
    video!.srcObject = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
};
</script>

<div>
    <button onclick={startStream}>Start</button>
    <video
        bind:this={video}
        autoplay
    ></video>

    <Chat />
</div>


<style lang="scss">
div {
    display: flex;
    flex-direction: column;

    > * {
        width: 100%;
    }
}
</style>