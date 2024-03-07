<script lang="ts">
	import '$src/app.pcss'
	import type { PageData } from './$types'
	import { queryStore, setContextClient } from '@urql/svelte'
	import { Toasts } from 'svoast'
	import { onMount, setContext } from 'svelte'
	import { page } from '$app/stores'
	import { browser } from '$app/environment'
	import { type FragmentType } from '$lib/gql'
	import { ActiveOrder, GetActiveOrder, Customer, GetCustomer } from '$lib/vendure'
	import { cookiesDisabledStore, cartStore, userStore } from '$lib/stores'
	import Theme from '$lib/components/Theme.svelte'
	import NavBar from '$lib/components/NavBar.svelte'
	import Footer from '$lib/components/Footer.svelte'

	export let data: PageData

	const client = data.client
	setContextClient(client)
	let retry: boolean = true
	
	const collections = data.collections
	
	let cart: FragmentType<typeof ActiveOrder>
	$: cartQuery = queryStore({ client, query: GetActiveOrder, pause: true, requestPolicy: 'network-only', context: { additionalTypenames: ['ActiveOrder'] } })
	// $: console.log($cartQuery)
	$: if (browser && $cartQuery?.data === undefined && retry) { console.log('retrying'); cartQuery.reexecute({}); retry = false; if ($cartQuery?.data === undefined) cookiesDisabledStore.set(true) }
	$: if (browser && $cartQuery?.data?.activeOrder) cart = $cartQuery.data.activeOrder
	$: if (browser) cartStore.set(cart) // stored as fragment

	let user: FragmentType<typeof Customer>
	$: userQuery = queryStore({ client, query: GetCustomer, pause: true, requestPolicy: 'network-only', context: { additionalTypenames: ['ActiveCustomer'] } })
	// $: console.log($userQuery)
	$: if (browser && $userQuery?.data?.activeCustomer) user = $userQuery.data.activeCustomer
	$: if (browser) userStore.set(user) // stored as fragment
	$: setContext('userQuery', userQuery)

	const nakedPaths = ['/auth', '/checkout', '/sitemap.xml']
	$: naked = nakedPaths.includes($page.url.pathname)

	onMount(() => {
		if (browser) {
			cartQuery.resume()
			userQuery.resume()
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

