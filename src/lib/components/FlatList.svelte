<script lang="ts">
const {
    items,
}: {
    items: {
        label: string,
        onClick: () => void,
    }[]
} = $props();
</script>

<flat-list>
    <item-separator></item-separator>

    {#each items as {label, onClick}, i}
        <button
            onclick={onClick}
        >
            <item-label>
                {label}
            </item-label>

            &gt;
        </button>

        <item-separator></item-separator>
    {/each}
</flat-list>

<style lang="scss">
flat-list {
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

item-separator {
    height: 1px;
    background: #ffffff3f;
}

button {
    background: none;
    border: none;
    text-align: left;
    padding: 1rem 2rem;

    display: flex;
    justify-content: space-between;
}
</style>