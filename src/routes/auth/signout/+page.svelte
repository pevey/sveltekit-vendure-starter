<script lang="ts">
	import type { PageData } from './$types'
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'
	import { cartStore, userStore } from '$lib/stores'
	export let data: PageData
	onMount(() => {
		if (browser && data.success === true) {
			cartStore.set(null)
			userStore.set(null)
		}
	})
</script>
{#if data.success === true}
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
