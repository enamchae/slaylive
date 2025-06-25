<script lang="ts">
let {
    label = null,
    value = $bindable(""),
    placeholder = "",
    disabled = false,
    onInput,
    onChange,
    classes = "",
    type = "text",
}: {
    label?: string | null,
    value?: string,
    placeholder?: string,
    disabled?: boolean,
    onInput?: (value: string) => void,
    onChange?: (value: string) => void,
    classes?: string,
    type?: "text" | "email" | "password",
} = $props();

let inputElement = $state<HTMLInputElement | null>(null);
let focused = $state(false);

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    value = target.value;
    onInput?.(value);
};

const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    value = target.value;
    onChange?.(value);
};

const handleFocus = () => {
    focused = true;
};

const handleBlur = () => {
    focused = false;
};
</script>

<input-container class={classes}>
    {#if label !== null}
        <input-label>{label}</input-label>
    {/if}

    <input-wrapper class:focused class:disabled>
        <input
            bind:this={inputElement}
            {type}
            {value}
            {placeholder}
            {disabled}
            oninput={handleInput}
            onchange={handleChange}
            onfocus={handleFocus}
            onblur={handleBlur}
        />
    </input-wrapper>
</input-container>

<style lang="scss">
input-container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
}

input-label {
    font-size: 1rem;
    font-weight: 400;
    font-family: var(--font-body);
    letter-spacing: 10%;
    text-transform: uppercase;
    opacity: 0.75;
}

input-wrapper {
    display: flex;
    align-items: center;
    border-radius: 1.5rem;
    background: #3f0b0b3f;
    border: 2px solid transparent;
    transition: all 0.2s ease;

    &.focused {
        background: #3f0b0b7f;
        border-color: #A910B1;
        box-shadow: 0 0.5rem 2rem #360f15 inset;
    }

    &.disabled {
        opacity: 0.5;
        pointer-events: none;
    }
}

input {
    flex: 1;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    outline: none;
    color: inherit;
    font-size: inherit;
    font-family: inherit;

    &::placeholder {
        color: inherit;
        opacity: 0.5;
    }
}
</style>
