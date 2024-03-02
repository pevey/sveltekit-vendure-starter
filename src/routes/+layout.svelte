<script lang="ts">
	import '$src/app.pcss'
	import type { PageData } from './$types'
	import { Client, cacheExchange, fetchExchange, setContextClient } from '@urql/svelte'
	import type { Collection, Customer, Order } from '$lib/gql/graphql'
	import { page } from '$app/stores'
	import NavBar from '$lib/components/NavBar.svelte'
	import Footer from '$lib/components/Footer.svelte'
	export let data: PageData
	const collections: Collection[] = data?.collections
	const nakedPaths = ['/auth', '/checkout', '/sitemap.xml']
	$: naked = nakedPaths.includes($page.url.pathname)
	$: user = data?.user as Customer
	$: cart = data?.cart as Order
	$: count = cart?.lines?.length as number || 0

	const client = new Client({
		url: 'https://lrc.pevey.dev/shop-api',
		exchanges: [cacheExchange, fetchExchange],
		// fetchOptions: () => {
		// 	const token = getToken()
		// 	return {
		// 		headers: { authorization: token ? `Bearer ${token}` : '' },
		// 	}
		// },
	})
	setContextClient(client)
</script>
{#if naked}
	<slot />
{:else}
	<NavBar {collections} bind:user={user} bind:cart={cart} bind:count={count} />
	<slot />
	<Footer />
{/if}

