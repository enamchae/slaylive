<script>

import { goto } from "$app/navigation";

</script>


<seller-dashboard>
    <h1>Seller dashboard</h1>
    
    <h2>Your stats</h2>
    
    <h2>Your products</h2>
    
    <button onclick={() => goto("/product?new")}>List a new product</button>
</seller-dashboard>


<style lang="scss">
seller-dashboard {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>