<script lang="ts">
    import { goto } from "$app/navigation";
import {apiFetchAuthorized} from "$routes/util";

let productTitle = $state("");
let productDescription = $state("");

const listProduct = async () => {
    await apiFetchAuthorized("product/new", {
        method: "PUT",
        body: JSON.stringify({
            productTitle,
            productDescription,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    goto("/seller/dashboard");
};
</script>

<h2>Title</h2>
<input
    type="text"
    bind:value={productTitle}
/>

<h2>Description</h2>
<textarea bind:value={productDescription}></textarea>

<button onclick={listProduct}>Create</button>