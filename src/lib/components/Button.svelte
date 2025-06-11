<script lang="ts">
    import type { Snippet } from "svelte";

const {
    onClick,
    children,
    strong = false,
} = $props<{
    onClick: () => void,
    children: Snippet,
    strong?: boolean,
}>();
</script>


<button
    onclick={onClick}
    class:strong={strong}
>
    {@render children()}
</button>

<style lang="scss">
button {
    margin: 0;
    padding: 0.75rem 2rem;
    display: flex;
    align-items: center;

    border: none;
    background: #fff5;
    color: inherit;
    border-radius: 2rem;
    box-shadow: 0 .25rem 2rem #FF5F2F3f;
    text-shadow: 0 2px 0.5rem #0000;

    transition: background 0.2s ease,
        text-shadow 0.2s ease,
        filter 0.2s ease;


    &:hover {
        cursor: pointer;
        background: #fff8;
        text-shadow: 0 2px 0.5rem #631919;
    }

    &:active {
        filter: brightness(0.75);
    }

    &.strong {
        background: linear-gradient(315deg, #A910B1, #ED7811);
        box-shadow: 0 .25rem 2rem #DF1A527f;

        &:hover {
            filter: brightness(1.25);
        }

        &:active {
            filter: brightness(0.75);
        }
    }
}
</style>