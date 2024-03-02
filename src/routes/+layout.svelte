<script lang="ts">
	import '$src/app.pcss'
	import type { PageData } from './$types'
	import { onMount } from 'svelte'
	import { queryStore, setContextClient } from '@urql/svelte'
	import { page } from '$app/stores'
	import { browser }	from '$app/environment'
   import { useFragment } from '$src/lib/gql'
	import { ActiveOrder, Customer, GetActiveOrder, GetCustomer, GetTopLevelCollections } from '$lib/vendure'
	import { user, cart } from '$lib/stores'
	import NavBar from '$lib/components/NavBar.svelte'
	import Footer from '$lib/components/Footer.svelte'

	export let data: PageData
	const client = data.client

	const nakedPaths = ['/auth', '/checkout', '/sitemap.xml']
	$: naked = nakedPaths.includes($page.url.pathname)

	setContextClient(client)

	$: collectionsQuery = queryStore({
			client,
			query: GetTopLevelCollections
	})
	$: collections = $collectionsQuery.data?.collections?.items || []

	$: customerQuery = queryStore({
			client,
			query: GetCustomer,
			pause: true
	})
	$: customer = $customerQuery.data?.activeCustomer || null
	$: user.set(customer)

	$: orderQuery = queryStore({
			client,
			query: GetActiveOrder,
			pause: true
	})
	$: order = $orderQuery.data?.activeOrder || null
	$: cart.set(order)
	$: console.log('order', order, cart)

	onMount(() => {
		if (browser) {
			customerQuery.resume()
			orderQuery.resume()
		}
	})

</script>
{#if naked}
	<slot />
{:else}
	<NavBar {collections} />
	<slot />
	<Footer />
{/if}

