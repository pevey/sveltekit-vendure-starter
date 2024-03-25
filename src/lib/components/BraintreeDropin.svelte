<script lang="ts">
	import type { Dropin, Options } from 'braintree-web-drop-in'
	import { create } from 'braintree-web-drop-in'
	import { onMount, createEventDispatcher } from 'svelte'
	import { dev } from '$app/environment'

	export let authorization: string
	export let options: Options

	let dropinContainer: Dropin
	const dispatch = createEventDispatcher()

	let mounted = false

	onMount(() => {         
		mounted = true
		return () => {
			mounted = false
		}
	})

	const dropin = (node: HTMLElement) => {
		create({ ...options, authorization, container: node })
		.then(instance => { dropinContainer = instance })
		.catch(e => { if (dev) console.error(e) })

		dropinContainer?.on('paymentMethodRequestable', event => {
			dispatch('paymentMethodRequestable', event)
		})


	}
</script>
{#if mounted}
	<div use:dropin />
{/if}

