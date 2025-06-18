<script lang="ts">
const {
    currentLabel,
    labels,
    onClickTab: onClick,
}: {
    currentLabel: string,
    labels: string[],
    onClickTab: (label: string) => void,
} = $props();

</script>

<tabber-tabs>
    {#each labels as label, i}
        <button
            onclick={() => onClick(label)}
            class:selected={label === currentLabel}
        >
            {label}
        </button>

        {#if i < labels.length}
            <tabber-separator></tabber-separator>
        {/if}
    {/each}
</tabber-tabs>

<style lang="scss">
tabber-tabs {
    display: flex;
    border: solid #ffffff3f;
    border-width: 1px 0;
}

tabber-separator {
    display: block;
    width: 1px;
    background: #ffffff3f;
}

button {
    flex-grow: 1;
    padding: 1rem 0;

    &.selected {
        background: #ffffff3f;
    }
}
</style>