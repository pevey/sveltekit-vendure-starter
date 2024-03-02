<script lang="ts">
	import { getContextClient, queryStore } from '@urql/svelte'
	import { useFragment } from '$lib/gql'
	import { GetProducts, Product } from '$lib/vendure'

	let take = 1
	let skip = 0
	$: products = queryStore({
			client: getContextClient(),
			query: GetProducts,
			variables: { options: { take, skip } },
	})
</script>

<h1>Client Products</h1>
{#if $products.fetching}
	<p>Loading...</p>
{:else}
	{#if $products.error}
		<p>Error: {$products.error.message}</p>
	{:else}
		{#if $products.data}
			{#each useFragment(Product, $products.data.products.items) as product}
				<div>
					<h2>{product.name}</h2>
					<p>{product.description}</p>
					<img src={product.featuredAsset?.preview} alt={product.name} />
					<p>Price: {product.variants[0].price}</p>
					<p>Stock: {product.variants[0].stockLevel}</p>
				</div>
			{/each}
		{/if}
	{/if}
{/if}
