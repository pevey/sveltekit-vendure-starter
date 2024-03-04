<script lang="ts">
	import '$src/app.pcss'
	import type { PageData } from './$types'
	import { queryStore, setContextClient } from '@urql/svelte'
	import { Toasts } from 'svoast'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { browser }	from '$app/environment'
	import { GetActiveOrder, GetCustomer } from '$lib/vendure'
	import { user, cart } from '$lib/stores'
	import Theme from '$lib/components/Theme.svelte'
	import NavBar from '$lib/components/NavBar.svelte'
	import Footer from '$lib/components/Footer.svelte'

	export let data: PageData
	const client = data.client
	const collections = data.collections

	const nakedPaths = ['/auth', '/checkout', '/sitemap.xml']
	$: naked = nakedPaths.includes($page.url.pathname)

	setContextClient(client)

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

	onMount(() => {
		if (browser) {
			customerQuery.resume()
			orderQuery.resume()
		}
	})
</script>
<Theme />
<Toasts />
{#if naked}
	<slot />
{:else}
	<NavBar {collections} />
	<slot />
	<Footer />
{/if}

