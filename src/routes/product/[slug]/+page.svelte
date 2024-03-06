<script lang="ts">
	import type { PageData } from './$types'
	import xss from 'xss'
	import { getContextClient, queryStore } from '@urql/svelte'
	import { queryParameters } from 'sveltekit-search-params'
	import { toast } from 'svoast'
	import { page } from '$app/stores'
	import { formatCurrency } from '$lib/utils'
	import { useFragment } from '$lib/gql'
	import { AddItemToOrder, GetProduct, ProductDetail } from '$lib/vendure'
	import MetaTags from '$lib/components/MetaTags.svelte'
	import Rating from '$lib/components/Rating.svelte'
	import ProductReviews from '$lib/components/ProductReviews.svelte'
	import FAQ from '$lib/components/FAQ.svelte'
	import Gallery from '$lib/components/Gallery.svelte'
	import Highlights from '$lib/components/Highlights.svelte'
	import { PUBLIC_DEFAULT_CURRENCY } from '$env/static/public'

	export let data: PageData

	const client = getContextClient()
	$: slug = $page.params.slug
	$: queryParams = queryParameters()
	$: tab = $queryParams?.tab || 'reviews'

	// these three will always be set from our PageData to enable SSR or SSG
	let product = useFragment(ProductDetail, data.product)
	let selectedVariantId = product?.variants[0]?.id || ''
	$: selectedVariantId = $queryParams?.variant || product?.variants[0]?.id || ''
	
	// these two enable the client to take over data fetching after the initial render
	$: productQuery = queryStore({ client, query: GetProduct, variables: { slug } })
	$: { if ($productQuery?.data?.product) product = useFragment(ProductDetail, $productQuery.data.product) }

	// Reviews have to be enabled first on the Vendure backend
	// $: reviews = product?.reviews || []

	let processing = false

	const addToCart = async (variantId: string): Promise<void> => {
		processing = true
		const result = await client.mutation(AddItemToOrder, { variantId: variantId, quantity: 1 }, { requestPolicy: 'network-only' }).toPromise()
		if (result.error) toast.error('Error adding item to cart')
		else if (result.data) toast.success('Item added to cart')
		processing = false
	}
</script>
{#if product}
<MetaTags title={product.name} description={product.description} />
<div class="max-w-screen-2xl mx-auto py-6 px-6 sm:px-12 md:px-14 lg:grid lg:grid-cols-2 lg:gap-x-6">
	<div class="lg:max-w-lg">
		<h1 class="text-2xl sm:text-3xl font-bold tracking-tight">{product.name}</h1>
		<h2 id="information-heading" class="sr-only">Product information</h2>
		<!-- <Rating rating={product.rating} /> -->
		<p class="mt-6">{@html xss(product.description || '')}</p>
		{#if (product.variants?.length && product.variants?.length > 1)}
			<div class="mt-6">
				{#each product.variants as variant}
					{#if (variant.id === selectedVariantId)}
						<button type="button" class="uppercase whitespace-nowrap px-3 py-2 mr-2 mb-2 rounded-lg text-sm font-medium border-4 border-lime-600">
							{variant.name}
						</button>
					{:else}
					<a href={`/product/${product.slug}?variant=${variant.id}`}>
						<button type="button" class="uppercase whitespace-nowrap px-3 py-2 mr-2 mb-2 rounded-lg text-sm font-medium border border-gray-400 hover:bg-stone-200 dark:hover:bg-stone-700">
							{variant.name}
						</button>
					</a>
					{/if}
				{/each}
			</div>
		{/if}
		<!-- {#each product.options as option}
		<div class="mt-6">
			<h3 class="text-sm font-medium">{option.title}</h3>
			<div class="mt-4">
				<div class="flex flex-wrap">
				{#each option.filteredValues as value}
				{#if value === selectedOptions[option.id]}
				<button type="button" class="uppercase whitespace-nowrap px-3 py-2 mr-2 mb-2 rounded-lg text-sm font-medium border-4 border-lime-600 bg-white hover:bg-white">
					{value}
				</button>
				{:else}
				<button type="button" on:click={(e) => { handleSelection(option, value) }} class="uppercase whitespace-nowrap px-3 py-2 mr-2 mb-2 rounded-lg text-sm font-medium border border-gray-400 bg-white hover:bg-stone-200">
					{value}
				</button>
				{/if}
				{/each}
				</div>
			</div>
		</div>
		{/each} -->
		<div class="mt-6">
			<h3 class="text-sm font-medium">Price</h3>
			{#if product.variants[product.variants.findIndex(v => v.id === selectedVariantId)]}
				<div class="mt-1 flex items-baseline">
					<p class="text-xl font-semibold">{formatCurrency(product.variants[product.variants.findIndex(v => v.id === selectedVariantId)].price, PUBLIC_DEFAULT_CURRENCY)}</p>
					<p class="ml-1 text-sm font-medium">/ {product.variants[product.variants.findIndex(v => v.id === selectedVariantId)]?.name}</p>
				</div>
			{:else}
				Select a Variant
			{/if}
		</div> 
		<button type="button" disabled={processing} on:click|preventDefault={ async () => { addToCart(selectedVariantId) }} class="mt-6 w-full items-center justify-center rounded-md border border-transparent bg-lime-600 px-5 py-3 text-base font-medium text-white hover:bg-lime-700">
			Add to Cart
		</button>
	</div>
	<div class="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 items-start">
		<Gallery assets={product.assets} />      
	</div>
	<div class="mb-4">
		<Highlights />
	</div>
	<!-- Tabs -->
	<div class="max-w-screen-lg lg:col-span-2">
		<div class="flex" aria-orientation="horizontal" role="tablist">
			<a href={`/product/${product.slug}?variant=${selectedVariantId}&tab=reviews`}>
				<button type="button" class="{tab === 'reviews' ? 
					"whitespace-nowrap p-3 pr-4 mr-4 border-b-2 font-medium border-lime-600" : 
					"whitespace-nowrap p-3 pr-4 mr-4 text-gray-500 hover:text-gray-700 border-b border-gray-300 hover:border-b-2 hover:border-gray-300"}">
					Customer Reviews
				</button>
			</a>
			<a href={`/product/${product.slug}?variant=${selectedVariantId}&tab=faq`}>
				<button type="button" class="{tab === 'faq' ? 
					"whitespace-nowrap p-3 px-4 mr-4 border-b-2 font-medium border-lime-600" : 
					"whitespace-nowrap p-3 px-4 mr-4 text-gray-500 hover:text-gray-700 border-b border-gray-300 hover:border-b-2 hover:border-gray-300"}">
					FAQ
				</button>
			</a>
		</div>
		{#if tab == 'reviews'}
			<!-- <ProductReviews bind:reviewForm={data.reviewForm} {product} {user} {reviews} /> -->
		{:else if tab == 'faq'}
			<FAQ/>
		{/if}
	</div>
</div>
{/if}