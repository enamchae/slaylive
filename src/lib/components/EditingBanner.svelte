<script lang="ts">
    import SubtleExclamation from "./SubtleExclamation.svelte";
    import Button from "./Button.svelte";
    import type { Snippet } from "svelte";

const {
    changesMade = false,
    onSave,
    onDiscard,
    children,
}: {
    changesMade: boolean
    onSave: () => void,
    onDiscard: () => void,
    children: Snippet,
} = $props();
</script>

<editing-banner>
    <Button
        onClick={() => changesMade && onDiscard()}
        disabled={!changesMade}
    >Discard</Button>

    <SubtleExclamation>{@render children()}</SubtleExclamation>

    <Button
        onClick={() => changesMade && onSave()}
        disabled={!changesMade}
        strong
    >Save</Button>
</editing-banner>

<style lang="scss">
editing-banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: repeating-linear-gradient(315deg, #0000 0 1rem, #ffffff11 1rem 2rem);

    margin-bottom: 3rem;
}
</style>