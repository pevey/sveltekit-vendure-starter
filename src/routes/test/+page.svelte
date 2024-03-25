<script lang="ts">
	import type { PageData } from './$types'
	import type { Dropin, Options } from 'braintree-web-drop-in'
	import { create } from 'braintree-web-drop-in'
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'
	import GooglePlacesAutocomplete from '$lib/components/GooglePlacesAutocomplete.svelte'
	import { PUBLIC_GOOGLE_PLACES_API_KEY } from '$env/static/public'

	export let data: PageData
	const authorization: string = data.authorization
	let dropin: Dropin
	let disabled: boolean = true

	const handlePlaceChanged = async (e: CustomEvent) => {
		console.log(e.detail)
	}

	const renderDropin = async () => {
		dropin = await create({ authorization, container: '#dropin-container' })
	}

	onMount(async () => {
		if (browser) {
			// updateStores()
			renderDropin()
			if (dropin?.isPaymentMethodRequestable()) disabled = false
			dropin?.on('paymentMethodRequestable', event => {
				console.log('paymentMethodRequestable', event)
				disabled = false
			})
		}
	})
</script>
{ authorization}
<GooglePlacesAutocomplete apiKey={PUBLIC_GOOGLE_PLACES_API_KEY} on:placeChanged={async (e) => await handlePlaceChanged(e)} />
<div id="dropin-container" class="rounded-md border border-gray-200 p-4"></div>
