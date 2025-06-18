<script lang="ts">
let {
    label = null,
    initialText,
    active = true,
    onInput,
    placeholder,
    classes = "",
}: {
    label?: string | null,
    initialText: string,
    active?: boolean,
    onInput: (value: string) => void,
    placeholder: string,
    classes?: string,
} = $props();

let text = $state(initialText);

let editing = $state(false);
let lastText = $state(initialText);

$effect(() => {
    if (entry !== null && entry !== document.activeElement) return;

    text = initialText;
});

$effect(() => {
    // Don't update the text while the user is editing
    if (editing) return;

    // Update the text
    lastText = initialText;
});

let entry = $state<HTMLUnknownElement | null>(null);

const updateText = () => {
    if (entry === null) return;

    text = entry.textContent ?? "";
    onInput(text);
};
</script>


<entry-container
    class={classes}
>
    {#if label !== null}
        <entry-label>{label}</entry-label>
    {/if}

    <entry-editable-container>
        {#if text.length === 0}
            <rich-text-placeholder>{placeholder}</rich-text-placeholder>
        {/if}

        <rich-text-entry
            class:active
            contenteditable
            oninput={() => updateText()}
            onfocus={() => editing = true}
            onblur={() => editing = false}
            bind:this={entry}
        >{lastText}</rich-text-entry>
    </entry-editable-container>
</entry-container>


<style lang="scss">
entry-container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

entry-label {
    font-size: 1rem;
    font-weight: 400;
    font-family: var(--font-body);
    letter-spacing: 10%;
    text-transform: uppercase;

    opacity: 0.75;
}

entry-editable-container {
    display: flex;
    flex-direction: column;
    align-items: stretch;

}

rich-text-entry {
    display: block;
    word-wrap: break-word;
    min-height: 1em;

    border-radius: 1.5rem;

    &.active {
        background: #3f0b0b7f;
        box-shadow:
            0 0.5rem 2rem #360f15 inset;
    }
}

rich-text-placeholder {
    position: absolute;
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
}

rich-text-entry,
rich-text-placeholder {
    padding: 0.25rem 0.5rem;
}
</style>