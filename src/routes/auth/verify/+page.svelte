<script lang="ts">
	import type { PageData } from './$types'
	import { getContextClient, queryStore } from '@urql/svelte'
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'
	import { type FragmentType } from '$lib/gql'
	import { ActiveOrder, GetActiveOrder, Customer, GetCustomer} from '$lib/vendure'
	import { cartStore, userStore } from '$lib/stores'
	import MetaTags from '$lib/components/MetaTags.svelte'

	export let data: PageData

	const client = getContextClient()

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

	onMount(() => {
		if (browser && data.result === 'CurrentUser') {
			customerQuery.resume()
			orderQuery.resume()
		}
	})
</script>
{#if data.result === 'CurrentUser'}
	<MetaTags title="Email Confirmation" />
	<div class="flex">
		<div class="mx-auto py-6 px-4 space-y-12">
			<p class="text-xl text-center">Your email has been verified.</p>
			<p class="text-lg text-center"><a href="/">&larr; Return to the home page</a>.</p>
		</div>
	</div>
{:else}
	<div class="flex">
		<div class="mx-auto py-6 px-4 space-y-12">
			<p class="text-xl text-center">There was an error verifying your email. Please try again.</p>
			<p class="text-lg text-center"><a href="/">&larr; Return to the home page</a>.</p>
		</div>
	</div>
{/if}