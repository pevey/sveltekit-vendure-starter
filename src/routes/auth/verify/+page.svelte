<script lang="ts">
	import type { PageData } from './$types'
	import { getContextClient } from '@urql/svelte'
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'
	import { GetActiveOrder, GetCustomer} from '$lib/vendure'
	import { cartStore, userStore } from '$lib/stores'
	import MetaTags from '$lib/components/MetaTags.svelte'

	export let data: PageData

	const client = getContextClient()

	const updateStores = async () => {
		const promises = Promise.all([
			client.query(GetActiveOrder, {}, { requestPolicy: 'network-only' }).toPromise(),
			client.query(GetCustomer, {}, { requestPolicy: 'network-only'} ).toPromise(),
		])
		const [orderResult, customerResult] = await promises
		if (orderResult?.data?.activeOrder) cartStore.set(orderResult.data.activeOrder)
		if (customerResult?.data?.activeCustomer) userStore.set(customerResult.data.activeCustomer)
	}

	onMount(() => {
		if (browser && data.result === 'CurrentUser') {
			updateStores()
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