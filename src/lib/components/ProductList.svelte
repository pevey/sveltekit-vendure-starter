<script lang="ts">
	import { type FragmentType, useFragment } from '$lib/gql'
	import { SearchResult } from '$lib/vendure'
	import ProductCard from '$lib/components/ProductCard.svelte'
	export let products: FragmentType<typeof SearchResult>[] = []
	$: products = products || []
</script>

<div class="mx-auto max-w-screen-2xl">
	<h2 id="products-heading" class="sr-only">Products</h2>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 gap-y-16 gap-x-6 my-8">
		{#each products as product}
			<ProductCard {product} />
		{/each}
	</div>
</div>