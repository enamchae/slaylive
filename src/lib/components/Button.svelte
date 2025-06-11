<script lang="ts">
    import type { Snippet } from "svelte";

const {
    onClick,
    children,
    disabled = false,
    strong = false,
} = $props<{
    onClick: () => void,
    children: Snippet,
    disabled?: boolean,
    strong?: boolean,
}>();
</script>


<button
    onclick={() => !disabled && onClick()}
    class:disabled
    class:strong
>
    {@render children()}
</button>

<style lang="scss">
button {
    margin: 0;
    padding: 0.75rem 2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    border: none;
    background: #ffdbac55;
    color: inherit;
    border-radius: 2rem;
    box-shadow: 0 .25rem 2rem #FF5F2F3f;
    text-shadow: 0 2px 0.5rem #0000;

    transition: background 0.2s ease,
        text-shadow 0.2s ease,
        filter 0.2s ease;


    &:hover {
        cursor: pointer;
        background: #ffdbac88;
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

    &.disabled {
        pointer-events: none;
        opacity: 0.3333333;
    }
}
</style>