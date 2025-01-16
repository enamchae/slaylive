<script lang="ts">
import Backstage from "$stories/Backstage.svelte";

// let video = $state<HTMLVideoElement | null>(null);

// const startStream = async () => {
//     video!.srcObject = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
// };
</script>

<Backstage />

<!-- 
<div>
    <button onclick={startStream}>Start</button>
    <video
        bind:this={video}
        autoplay
    ></video> -->

<!-- </div> -->


<!-- <style lang="scss">
div {
    display: flex;
    flex-direction: column;

    > * {
        width: 100%;
    }
}
</style> -->