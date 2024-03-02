<script lang="ts">
	import { getContextClient, queryStore } from '@urql/svelte'
	import { useFragment } from '$lib/gql'
	import { page } from '$app/stores'
	import { Collection, SearchResult, GetCollection, GetCollectionProducts } from '$lib/vendure'
	import VendureAsset from '$lib/components/VendureAsset.svelte'
	import MetaTags from '$lib/components/MetaTags.svelte'

	$: slug = $page.params.slug

	$: collectionQuery = queryStore({
		client: getContextClient(),
		query: GetCollection,
		variables: { slug }
	})
	$: collection = useFragment(Collection, $collectionQuery.data?.collection) || null

	$: productsQuery = queryStore({
		client: getContextClient(),
		query: GetCollectionProducts,
		variables: { slug }
	})
	$: products = useFragment(SearchResult, $productsQuery.data?.search?.items) || []

</script>
<MetaTags title={collection?.name} description={collection?.description} />
<section class="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
	<h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 my-4 sm:my-6">{collection?.name}</h1>
	<section class="relative hidden sm:block sm:h-80 lg:h-96 w-full mb-8 sm:mb-16">
		<VendureAsset preview={collection?.featuredAsset?.preview} preset="large" alt={collection?.name} class="absolute object-cover w-full h-full rounded-md"/>
		<div class="absolute inset-0 bg-black/30 flex items-center justify-center rounded-md">
			<h1 class="text-3xl font-bold text-white">{collection?.name}</h1>
		</div>
	</section>
	<div class="mx-auto max-w-screen-2xl">
		<h2 id="products-heading" class="sr-only">Products</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 gap-y-16 gap-x-6 my-8">
			{#each products as { slug, productName, productAsset }}
				<a href="/product/{slug}" class="group">
					<VendureAsset preview={productAsset?.preview} preset="medium" alt={productName} class="mx-auto object-cover h-80 w-80 object-center group-hover:opacity-75 overflow-hidden rounded-lg"/>
					<div class="flex">
						<div class="mx-auto">
							<h3 class="mt-4 text-lg font-bold text-gray-700">{productName}</h3>
							<!-- <p class="mt-1 text-lg font-medium text-gray-900">{product.price.value || product.price.min}</p> -->
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>
