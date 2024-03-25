<script lang="ts">
	import { Loader } from '@googlemaps/js-api-loader'
	import { createEventDispatcher, onMount } from 'svelte'
	import { browser } from '$app/environment'

	export let id: string = `gm-autocomplete-${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}`
	export let apiKey: string
	export let ariaLabel: string = 'location'
	export let placeholder: string = 'Location'
	export let styleClass: string = ''
	export let value: string|undefined = undefined
	export let viewValue: string|undefined = undefined
	export let fields: string[] = [ 'geometry', 'formatted_address' ]
	export let types: string[] = [ 'address' ]
	export let options: {} = {}

	let searchBox: HTMLInputElement
	let autocomplete: google.maps.places.Autocomplete
	let currentPlace: google.maps.places.PlaceResult|null
	let disabled = true

	const dispatch = createEventDispatcher()

	export function clear () {
		value = undefined
		viewValue = undefined
		currentPlace = null
		dispatch('clear')
	}

	function blur () {
		dispatch('blur')
		if (viewValue !== (currentPlace && currentPlace.formatted_address)) {
			clear()
		}
	}

	function dropdownVisible () {
		// @ts-ignore
    	return document.querySelectorAll('.pac-container')[0].offsetParent !== null
  	}

	function autocompleteKeydown (e: any) {
		if (e.keyCode === 13 && dropdownVisible()) {
			e.preventDefault()
		}
	}

	onMount(() => {
		if (browser) {
			const loader = new Loader({
				apiKey,
				version: "weekly",
				libraries: ["places"]
			})
			loader.importLibrary('places').then((places) => {
				autocomplete = new places.Autocomplete(searchBox, Object.assign({ fields, types }, options))
				disabled = false
				autocomplete.addListener('place_changed', () => {
					const place = autocomplete.getPlace()
					if (place.geometry) {
						viewValue = place.formatted_address
						value = viewValue
						currentPlace = place
						dispatch('placeChanged', { place, selectedPrediction: searchBox.value })
					}
				})
			})
		}
	})

</script>
<input {id} aria-label={ariaLabel} class={styleClass} {placeholder} bind:this={searchBox} type="text" {disabled} bind:value={viewValue} on:blur={blur} on:keydown={autocompleteKeydown} />