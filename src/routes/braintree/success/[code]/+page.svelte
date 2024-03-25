<script lang="ts">
	import type { PageData } from './$types'
	import CheckoutSuccess from '$lib/components/CheckoutSuccess.svelte'
	export let data: PageData
</script>
{#if data.code}
	<CheckoutSuccess code={data.code} />
{:else}
	<p>Order not found</p>
{/if}