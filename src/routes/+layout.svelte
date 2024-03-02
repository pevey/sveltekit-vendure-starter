<script lang="ts">
	import '$src/app.pcss'
	import type { PageData } from './$types'
	import { Client, cacheExchange, fetchExchange, ssrExchange, queryStore, setContextClient } from '@urql/svelte'
	import { page } from '$app/stores'
	import { browser, dev }	from '$app/environment'
   import { useFragment } from '$src/lib/gql'
	import { ActiveOrder, GetActiveOrder, GetCustomer, GetTopLevelCollections } from '$lib/vendure'
	import NavBar from '$lib/components/NavBar.svelte'
	import Footer from '$lib/components/Footer.svelte'
	import { PUBLIC_SHOPAPI_DEV_URL, PUBLIC_SHOPAPI_PROD_URL } from '$env/static/public'

	export let data: PageData

	const nakedPaths = ['/auth', '/checkout', '/sitemap.xml']
	$: naked = nakedPaths.includes($page.url.pathname)

	const ssr = ssrExchange({ 
		isClient: browser,
		initialState: browser? window.__URQL_DATA__ : undefined
	})

	const client = new Client({
		url: dev? PUBLIC_SHOPAPI_DEV_URL : PUBLIC_SHOPAPI_PROD_URL,
		exchanges: [cacheExchange, ssr, fetchExchange],
		// fetchOptions: () => {
		// 	const token = getToken()
		// 	return {
		// 		headers: { authorization: token ? `Bearer ${token}` : '' },
		// 	}
		// },
	})
	setContextClient(client)



	$: collectionsQuery = queryStore({
			client,
			query: GetTopLevelCollections
	})
	$: collections = $collectionsQuery.data?.collections?.items || []

	$: customerQuery = queryStore({
			client,
			query: GetCustomer
	})
	$: customer = $customerQuery.data?.activeCustomer || null

	$: orderQuery = queryStore({
			client,
			query: GetActiveOrder
	})
	$: order = $orderQuery.data?.activeOrder || null
	$: count = useFragment(ActiveOrder, order)?.lines?.length || 0
</script>
{#if naked}
	<slot />
{:else}
	<NavBar {collections} bind:customer bind:order bind:count />
	<slot />
	<Footer />
{/if}

