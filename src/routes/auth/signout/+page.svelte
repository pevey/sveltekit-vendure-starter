<script lang="ts">
	import { getContextClient } from '@urql/svelte'
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'
	import { SignOut } from '$lib/vendure'
	import { cartStore, userStore } from '$lib/stores'

	const client = getContextClient()
	let result: any
	let success: boolean

	onMount(() => {
		if (browser) {
			handleSignOut()
		}
	})
	
	const handleSignOut = async () => {
		result = await client.mutation(SignOut, {}).toPromise()
		success = result?.data?.logout?.success
		if (success) {
			cartStore.set(null)
			userStore.set(null)
		}
	}
</script>
{#if success === true}
	<div class="flex">
		<div class="mx-auto py-6 px-4 space-y-12">
			<p class="text-xl text-center">You have been successfully signed out.</p>
			<p class="text-lg text-center"><a href="/">&larr; Return to the home page</a>.</p>
		</div>
	</div>
{:else}
	<div class="flex">
		<div class="mx-auto py-6 px-4 space-y-12">
			<p class="text-xl text-center">There was an error signing you out. Please try again.</p>
		</div>
	</div>
{/if}
