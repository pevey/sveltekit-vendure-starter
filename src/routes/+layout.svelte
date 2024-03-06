<script lang="ts">
	import '$src/app.pcss'
	import type { PageData } from './$types'
	import { queryStore, setContextClient } from '@urql/svelte'
	import { Toasts } from 'svoast'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { browser } from '$app/environment'
	import { type FragmentType } from '$lib/gql'
	import { ActiveOrder, GetActiveOrder, Customer, GetCustomer } from '$lib/vendure'
	import { cartStore, userStore } from '$lib/stores'
	import Theme from '$lib/components/Theme.svelte'
	import NavBar from '$lib/components/NavBar.svelte'
	import Footer from '$lib/components/Footer.svelte'

	export let data: PageData

	const client = data.client
	setContextClient(client)
	
	const collections = data.collections
	
	let cart: FragmentType<typeof ActiveOrder>
	$: cartQuery = queryStore({ client, query: GetActiveOrder, pause: true })
	$: { if ($cartQuery?.data?.activeOrder) cart = $cartQuery.data.activeOrder }
	$: cartStore.set(cart) // we store as fragment to make typing possible

	let user: FragmentType<typeof Customer>
	$: userQuery = queryStore({ client, query: GetCustomer, pause: true })
	$: { if ($userQuery?.data?.activeCustomer) user = $userQuery.data.activeCustomer }
	$: userStore.set(user) // we store as fragment to make typing possible

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

