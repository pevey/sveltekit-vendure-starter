<script lang="ts">
	import { type FragmentType, useFragment } from '$lib/gql'
	import { SearchResult } from '$lib/vendure'
	import VendureAsset from '$lib/components/VendureAsset.svelte'
	export let product: FragmentType<typeof SearchResult>
	const { slug, productName, productAsset } = useFragment(SearchResult, product)
</script>

<a href="/product/{slug}" class="group">
	<VendureAsset preview={productAsset?.preview} preset="medium" alt={productName} class="mx-auto object-cover h-80 w-80 object-center group-hover:opacity-75 overflow-hidden rounded-lg"/>
	<div class="flex">
		<div class="mx-auto">
			<h3 class="mt-4 text-lg font-bold text-gray-700">{productName}</h3>
			<!-- <p class="mt-1 text-lg font-medium text-gray-900">{product.price.value || product.price.min}</p> -->
		</div>
	</div>
</a>