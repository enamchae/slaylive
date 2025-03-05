<script lang="ts">
let {
    initialText,
    onInput,
    placeholder,
}: {
    initialText: string,
    onInput: (value: string) => void,
    placeholder: string
} = $props();

let text = $state(initialText);
$effect(() => {
    if (entry !== null && entry !== document.activeElement) return;

    text = initialText;
});

let entry = $state<HTMLUnknownElement | null>(null);
</script>


<rich-text-entry-container>
    {#if text.length === 0}
        <rich-text-placeholder>{placeholder}</rich-text-placeholder>
    {/if}
    <rich-text-entry
        contenteditable
        oninput={() => entry !== null && onInput(entry.textContent ?? "")}
        bind:this={entry}
    >{text}</rich-text-entry>
</rich-text-entry-container>


<style lang="scss">
rich-text-entry-container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

rich-text-entry {
    display: block;
    word-wrap: break-word;
    min-height: 1em;
    outline-offset: 0.5rem;
}

rich-text-placeholder {
    position: absolute;
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
}
</style>