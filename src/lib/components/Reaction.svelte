<script lang="ts">
    import { onDestroy, onMount } from "svelte";

const {
    emoji,
    onAnimationEnd,
}: {
    emoji: string,
    onAnimationEnd: () => void,
} = $props();


let startTime = $state(0);
let elapsedTime = $state(0);
let animationFrameHandle = $state(0);

const render = (now: number) => {
    if (startTime === 0) {
        startTime = now;
    }

    elapsedTime = now - startTime;
 
    animationFrameHandle = requestAnimationFrame(render);
};

onMount(() => {
    animationFrameHandle = requestAnimationFrame(render);
});

onDestroy(() => {
    cancelAnimationFrame(animationFrameHandle);
});


$effect(() => {
    if (elapsedTime < 3000) return;

    onAnimationEnd();
});
</script>

<reaction-emoji>{emoji}</reaction-emoji>

<style lang="scss">
reaction-emoji {
    position: absolute;
    animation: grow 3s linear;
    pointer-events: none;

    @keyframes grow {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }

        100% {
            transform: translate(0, -15em) scale(2);
            opacity: 0;
        }
    }
}
</style>