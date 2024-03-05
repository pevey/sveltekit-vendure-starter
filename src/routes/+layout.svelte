<script lang="ts">
	import '$src/app.pcss'
	import type { PageData } from './$types'
	import { queryStore, getContextClient, setContextClient } from '@urql/svelte'
	import { Toasts } from 'svoast'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { browser } from '$app/environment'
	import { type FragmentType } from '$lib/gql'
	import { createClient, ActiveOrder, GetActiveOrder, Customer, GetCustomer } from '$lib/vendure'
	import { cartStore, userStore } from '$lib/stores'
	import Theme from '$lib/components/Theme.svelte'
	import NavBar from '$lib/components/NavBar.svelte'
	import Footer from '$lib/components/Footer.svelte'

	export let data: PageData

	const client = createClient()
	setContextClient(client)
	
	const collections = data.collections
	
	let order: FragmentType<typeof ActiveOrder>
	$: orderQuery = queryStore({
		client,
		query: GetActiveOrder,
		pause: true
	})
	$: { if ($orderQuery?.data?.activeOrder) order = $orderQuery.data.activeOrder }
	$: cartStore.set(order) // we store as fragment to make typing possible when passing to components

	let customer: FragmentType<typeof Customer>
	$: customerQuery = queryStore({
			client,
			query: GetCustomer,
			pause: true
	})
	$: { if ($customerQuery?.data?.activeCustomer) customer = $customerQuery.data.activeCustomer }
	$: userStore.set(customer) // we store as fragment to make typing possible when passing to components

	const nakedPaths = ['/auth', '/checkout', '/sitemap.xml']
	$: naked = nakedPaths.includes($page.url.pathname)

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

