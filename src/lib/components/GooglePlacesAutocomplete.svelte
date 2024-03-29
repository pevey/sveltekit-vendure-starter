<script lang="ts">
	import { Loader } from '@googlemaps/js-api-loader'
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms'
	import { z } from 'zod'
	import { createEventDispatcher, onMount } from 'svelte'
	import { browser } from '$app/environment'

	export let validator = z.object({
		emailAddress: z.string().email().refine((val) => val.length > 0, { message: 'Email is required' }),
		firstName: z.string().min(1, { message: 'Field is required' }),
		lastName: z.string().min(1, { message: 'Field is required' }),
		streetLine1: z.string().min(1, { message: 'Field is required' }),
		streetLine2: z.string().optional(),
		city: z.string().min(1, { message: 'Field is required' }),
		province: z.string().min(1, { message: 'Field is required' }),
		country: z.string().min(1, { message: 'Field is required' }),
		countryCode: z.string().min(1, { message: 'Field is required' }),
		postalCode: z.string().min(1, { message: 'Field is required' }),
		phoneNumber: z.string().min(1, { message: 'Field is required' }),
		billingFirstName: z.string().optional(),
		billingLastName: z.string().optional(),
		billingStreetLine1: z.string().optional(),
		billingStreetLine2: z.string().optional(),
		billingCity: z.string().optional(),
		billingProvince: z.string().optional(),
		billingCountry: z.string().optional(),
		billingCountryCode: z.string().optional(),
		billingPostalCode: z.string().optional(),
		billingPhoneNumber: z.string().optional()
	})
	validator // makes vscode stop complaining about supposedly unused variable

	type schema = typeof validator

	export let apiKey: string
	export let form: SuperValidated<Infer<schema>>
	export let singleInput: boolean = false
	export let labelClass: string = ''
	export let inputClass: string = ''
	export let viewValue: string|undefined = undefined
	export let fields: string[] = [ 'geometry', 'formatted_address', 'address_components' ]
	export let types: string[] = [ 'address' ]
	export let options: {} = {}

	let searchBox: HTMLInputElement
	let autocomplete: google.maps.places.Autocomplete
	let currentPlace: google.maps.places.PlaceResult|null
	let showDetail: boolean = false
	let billingSearchBox: HTMLInputElement
	let billingAutocomplete: google.maps.places.Autocomplete
	let billingCurrentPlace: google.maps.places.PlaceResult|null
	let showBillingDetail: boolean = false
	let disabled: boolean = true

	const { form: formData, errors, constraints } = superForm(form)
	const dispatch = createEventDispatcher()

	export function clear () {
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
				if (singleInput) {
					autocomplete = new places.Autocomplete(searchBox, Object.assign({ fields, types }, options))
					autocomplete.addListener('place_changed', () => {
						const place = autocomplete.getPlace()
						if (place.geometry) {
							currentPlace = place
							viewValue = place.formatted_address
							dispatch('placeChanged', { place, type: 'shipping', selectedPrediction: searchBox.value })
						}
					})
					disabled = false
					return
				}
				autocomplete = new places.Autocomplete(searchBox, Object.assign({ fields, types }, options))
				autocomplete.addListener('place_changed', () => {
					const place = autocomplete.getPlace()
					if (place.geometry) {
						currentPlace = place
						$formData.streetLine1 = place.address_components?.find((c: any) => c.types.includes('street_number'))?.long_name || ''
						$formData.streetLine1 += ' ' + place.address_components?.find((c: any) => c.types.includes('route'))?.long_name || ''
						$formData.streetLine2 = place.address_components?.find((c: any) => c.types.includes('subpremise'))?.long_name || ''
						$formData.city = place.address_components?.find((c: any) => c.types.includes('locality'))?.long_name || ''
						$formData.province = place.address_components?.find((c: any) => c.types.includes('administrative_area_level_1'))?.long_name || ''
						$formData.country = place.address_components?.find((c: any) => c.types.includes('country'))?.long_name || ''
						$formData.countryCode = place.address_components?.find((c: any) => c.types.includes('country'))?.short_name.toLowerCase() || ''
						$formData.postalCode = place.address_components?.find((c: any) => c.types.includes('postal_code'))?.long_name || ''
						showDetail = true
						dispatch('placeChanged', { place, type: 'shipping', selectedPrediction: searchBox.value })
					}
				})
				billingAutocomplete = new places.Autocomplete(billingSearchBox, Object.assign({ fields, types }, options))
				billingAutocomplete.addListener('place_changed', () => {
					const place = billingAutocomplete.getPlace()
					if (place.geometry) {
						billingCurrentPlace = place
						$formData.billingStreetLine1 = place.address_components?.find((c: any) => c.types.includes('street_number'))?.long_name || ''
						$formData.billingStreetLine1 += ' ' + place.address_components?.find((c: any) => c.types.includes('route'))?.long_name || ''
						$formData.billingStreetLine2 = place.address_components?.find((c: any) => c.types.includes('subpremise'))?.long_name || ''
						$formData.billingCity = place.address_components?.find((c: any) => c.types.includes('locality'))?.long_name || ''
						$formData.billingProvince = place.address_components?.find((c: any) => c.types.includes('administrative_area_level_1'))?.long_name || ''
						$formData.billingCountry = place.address_components?.find((c: any) => c.types.includes('country'))?.long_name || ''
						$formData.billingCountryCode = place.address_components?.find((c: any) => c.types.includes('country'))?.short_name.toLowerCase() || ''
						$formData.billingPostalCode = place.address_components?.find((c: any) => c.types.includes('postal_code'))?.long_name || ''
						showBillingDetail = true
						dispatch('placeChanged', { place, type: 'billing', selectedPrediction: searchBox.value })
					}
				})
				disabled = false
			})
		}
	})
</script>

{#if singleInput}
	<input id="google-places-autocomplete" aria-label="location" class={inputClass} placeholder="Location" bind:this={searchBox} type="text" {disabled} bind:value={viewValue} on:blur={blur} on:keydown={autocompleteKeydown} />
{:else}
	<!-- Shipping Address -->
	<h3 class="pb-6 text-lg font-medium text-gray-900">Shipping Address</h3>
	<div class="border border-gray-400 rounded p-2 pb-6">
		<div class="grid grid-cols-2">
			<div class="col-span-1 p-2">
				<label for="firstName" class={labelClass}>First name</label>
				<input 
					bind:value={$formData.firstName} 
					id="firstName"
					name="firstName"
					placeholder="Your first name" 
					type="text"
					aria-describedby={$errors.firstName ? "firstName-error" : undefined}
					aria-invalid={$errors.firstName ? "true" : undefined}
					aria-required={$constraints.firstName?.required ? "true" : undefined}
					class={`w-full ${inputClass}`} 
				/>
				<span id="firstName-error" aria-live="assertive">
					{#if $errors.firstName?.length}
						{#each $errors.firstName as err}
							<span class="text-red-600">{err}</span>
						{/each}
					{/if}
				</span>
			</div>
			<div class="col-span-1 p-2">
				<label for="lastName" class={labelClass}>Last name</label>
				<input 
					bind:value={$formData.lastName} 
					id="lastName"
					name="lastName"
					placeholder="Your last name" 
					type="text"
					aria-describedby={$errors.lastName ? "lastName-error" : undefined}
					aria-invalid={$errors.lastName ? "true" : undefined}
					aria-required={$constraints.lastName?.required ? "true" : undefined}
					class={`w-full ${inputClass}`} 
				/>
				<span id="lastName-error" aria-live="assertive">
					{#if $errors.lastName?.length}
						{#each $errors.lastName as err}
							<span class="text-red-600">{err}</span>
						{/each}
					{/if}
				</span>
			</div>
			<div class="col-span-2 p-2">
				<label for="streetLine1" class={labelClass}>Address</label>
				<input 
					bind:this={searchBox}
					on:blur={blur} 
					on:keydown={autocompleteKeydown}
					bind:value={$formData.streetLine1} 
					id="streetLine1"
					name="streetLine1"
					placeholder="Address" 
					type="text"
					aria-describedby={$errors.streetLine1 ? "streetLine1-error" : undefined}
					aria-invalid={$errors.streetLine1 ? "true" : undefined}
					aria-required={$constraints.streetLine1?.required ? "true" : undefined}
					class={`w-full ${inputClass}`} 
				/>
				<span id="streetLine1-error" aria-live="assertive">
					{#if $errors.streetLine1?.length}
						{#each $errors.streetLine1 as err}
							<span class="text-red-600">{err}</span>
						{/each}
					{/if}
				</span>
			</div>
			{#if showDetail}
				<div class="col-span-2 p-2">
					<label for="streetLine2" class={labelClass}>Apt/Suite</label>
					<input 
						bind:value={$formData.streetLine2} 
						id="streetLine2"
						name="streetLine2"
						placeholder="Apartment or Suite" 
						type="text"
						aria-describedby={$errors.streetLine2 ? "streetLine2-error" : undefined}
						aria-invalid={$errors.streetLine2 ? "true" : undefined}
						aria-required={$constraints.streetLine2?.required ? "true" : undefined}
						class="w-full p-3 rounded border-gray-400 ring-0 focus:ring-0 focus:border-gray-800" 
					/>
					<span id="streetLine2-error" aria-live="assertive">
						{#if $errors.streetLine2?.length}
							{#each $errors.streetLine2 as err}
								<span class="text-red-600">{err}</span>
							{/each}
						{/if}
					</span>
				</div>
				<div class="col-span-1 p-2">
					<label for="city" class={labelClass}>City</label>
					<input 
						bind:value={$formData.city} 
						id="city"
						name="city"
						placeholder="City" 
						type="text"
						aria-describedby={$errors.city ? "city-error" : undefined}
						aria-invalid={$errors.city ? "true" : undefined}
						aria-required={$constraints.city?.required ? "true" : undefined}
						class="w-full p-3 rounded border-gray-400 ring-0 focus:ring-0 focus:border-gray-800" 
					/>
					<span id="city-error" aria-live="assertive">
						{#if $errors.city?.length}
							{#each $errors.city as err}
								<span class="text-red-600">{err}</span>
							{/each}
						{/if}
					</span>
				</div>
				<div class="col-span-1 p-2">
					<label for="province" class={labelClass}>State</label>
					<input 
						bind:value={$formData.province} 
						id="province"
						name="province"
						placeholder="State or Province" 
						type="text"
						aria-describedby={$errors.province ? "province-error" : undefined}
						aria-invalid={$errors.province ? "true" : undefined}
						aria-required={$constraints.province?.required ? "true" : undefined}
						class="w-full p-3 rounded border-gray-400 ring-0 focus:ring-0 focus:border-gray-800" 
					/>
					<span id="province-error" aria-live="assertive">
						{#if $errors.province?.length}
							{#each $errors.province as err}
								<span class="text-red-600">{err}</span>
							{/each}
						{/if}
					</span>
				</div>
				<div class="col-span-1 p-2">
					<label for="country" class={labelClass}>Country</label>
					<input 
						bind:value={$formData.country} 
						id="country"
						name="country"
						placeholder="Country" 
						type="text"
						aria-describedby={$errors.country ? "country-error" : undefined}
						aria-invalid={$errors.country ? "true" : undefined}
						aria-required={$constraints.country?.required ? "true" : undefined}
						class="w-full p-3 rounded border-gray-400 ring-0 focus:ring-0 focus:border-gray-800" 
					/>
					<span id="country-error" aria-live="assertive">
						{#if $errors.country?.length}
							{#each $errors.country as err}
								<span class="text-red-600">{err}</span>
							{/each}
						{/if}
					</span>
				</div>
				<div class="col-span-1 p-2">
					<label for="postalCode" class={labelClass}>Zip code</label>
					<input 
						bind:value={$formData.postalCode} 
						id="postalCode"
						name="postalCode"
						placeholder="Zip Code" 
						type="text"
						aria-describedby={$errors.postalCode ? "postalCode-error" : undefined}
						aria-invalid={$errors.postalCode ? "true" : undefined}
						aria-required={$constraints.postalCode?.required ? "true" : undefined}
						class="w-full p-3 rounded border-gray-400 ring-0 focus:ring-0 focus:border-gray-800" 
					/>
					<span id="postalCode-error" aria-live="assertive">
						{#if $errors.postalCode?.length}
							{#each $errors.postalCode as err}
								<span class="text-red-600">{err}</span>
							{/each}
						{/if}
					</span>
				</div>
				<div class="col-span-2 p-2">
					<label for="phoneNumber" class={labelClass}>Phone</label>
					<input 
						bind:value={$formData.phoneNumber} 
						id="phoneNumber"
						name="phoneNumber"
						placeholder="Phone number" 
						type="text"
						aria-describedby={$errors.phoneNumber ? "phoneNumber-error" : undefined}
						aria-invalid={$errors.phoneNumber ? "true" : undefined}
						aria-required={$constraints.phoneNumber?.required ? "true" : undefined}
						class={`w-full ${inputClass}`} 
					/>
					<span id="phoneNumber-error" aria-live="assertive">
						{#if $errors.phoneNumber?.length}
							{#each $errors.phoneNumber as err}
								<span class="text-red-600">{err}</span>
							{/each}
						{/if}
					</span>
				</div>
				<div class="col-span-2 p-2">
					<label for="emailAddress" class="text-sm">Email</label>
					<input 
						bind:value={$formData.emailAddress} 
						id="emailAddress"
						name="emailAddress"
						placeholder="Your email address" 
						type="text"
						aria-describedby={$errors.emailAddress ? "emailaddress-error" : undefined}
						aria-invalid={$errors.emailAddress ? "true" : undefined}
						aria-required={$constraints.emailAddress?.required ? "true" : undefined}
						class="w-full p-3 rounded border-gray-400 ring-0 focus:ring-0 focus:border-gray-800" 
					/>
					<span id="emailaddress-error" aria-live="assertive">
						{#if $errors.emailAddress?.length}
							{#each $errors.emailAddress as err}
								<span class="text-red-600">{err}</span>
							{/each}
						{/if}
					</span>
				</div>
			{/if}
		</div>
	</div>
	<!-- TODO: add checkbox -->
	<!-- Billing Address -->
	<h3 class="mt-6 pb-6 text-lg font-medium text-gray-900">Billing Address</h3>
	<div class="border border-gray-400 rounded p-2 pb-6">
		<div class="grid grid-cols-2">
			<div class="col-span-1 p-2">
				<label for="billingFirstName" class={labelClass}>First name</label>
				<input 
					bind:value={$formData.billingFirstName} 
					id="billingFirstName"
					name="billingfirstName"
					placeholder="Your first name" 
					type="text"
					aria-describedby={$errors.billingFirstName ? "billingfirstname-error" : undefined}
					aria-invalid={$errors.billingFirstName ? "true" : undefined}
					aria-required={$constraints.billingFirstName?.required ? "true" : undefined}
					class={`w-full ${inputClass}`} 
				/>
				<span id="billingfirstname-error" aria-live="assertive">
					{#if $errors.billingFirstName?.length}
						{#each $errors.billingFirstName as err}
							<span class="text-red-600">{err}</span>
						{/each}
					{/if}
				</span>
			</div>
			<div class="col-span-1 p-2">
				<label for="billingLastName" class={labelClass}>Last name</label>
				<input 
					bind:value={$formData.billingLastName} 
					id="lastName"
					name="lastName"
					placeholder="Your last name" 
					type="text"
					aria-describedby={$errors.billingLastName ? "billinglastname-error" : undefined}
					aria-invalid={$errors.billingLastName ? "true" : undefined}
					aria-required={$constraints.billingLastName?.required ? "true" : undefined}
					class={`w-full ${inputClass}`} 
				/>
				<span id="billinglastname-error" aria-live="assertive">
					{#if $errors.billingLastName?.length}
						{#each $errors.billingLastName as err}
							<span class="text-red-600">{err}</span>
						{/each}
					{/if}
				</span>
			</div>
			<div class="col-span-2 p-2">
				<label for="billingStreetLine1" class={labelClass}>Address</label>
				<input 
					bind:this={billingSearchBox}
					on:blur={blur} 
					on:keydown={autocompleteKeydown}
					bind:value={$formData.billingStreetLine1} 
					id="billingStreetLine1"
					name="billingStreetLine1"
					placeholder="Address" 
					type="text"
					aria-describedby={$errors.billingStreetLine1 ? "billingStreetLine1-error" : undefined}
					aria-invalid={$errors.billingStreetLine1 ? "true" : undefined}
					aria-required={$constraints.billingStreetLine1?.required ? "true" : undefined}
					class={`w-full ${inputClass}`} 
				/>
				<span id="billingStreetLine1-error" aria-live="assertive">
					{#if $errors.billingStreetLine1?.length}
						{#each $errors.billingStreetLine1 as err}
							<span class="text-red-600">{err}</span>
						{/each}
					{/if}
				</span>
			</div>
			{#if showBillingDetail}
				<div class="col-span-2 p-2">
					<label for="billingStreetLine2" class={labelClass}>Apt/Suite</label>
					<input 
						bind:value={$formData.billingStreetLine2} 
						id="billingStreetLine2"
						name="billingStreetLine2"
						placeholder="Apartment or Suite" 
						type="text"
						aria-describedby={$errors.billingStreetLine2 ? "billingStreetLine2-error" : undefined}
						aria-invalid={$errors.billingStreetLine2 ? "true" : undefined}
						aria-required={$constraints.billingStreetLine2?.required ? "true" : undefined}
						class={`w-full ${inputClass}`} 
					/>
					<span id="billingStreetLine2-error" aria-live="assertive">
						{#if $errors.billingStreetLine2?.length}
							{#each $errors.billingStreetLine2 as err}
								<span class="text-red-600">{err}</span>
							{/each}
						{/if}
					</span>
				</div>
				<div class="col-span-1 p-2">
					<label for="billingCity" class={labelClass}>City</label>
					<input 
						bind:value={$formData.billingCity} 
						id="billingCity"
						name="billingCity"
						placeholder="City" 
						type="text"
						aria-describedby={$errors.billingCity ? "billingCity-error" : undefined}
						aria-invalid={$errors.billingCity ? "true" : undefined}
						aria-required={$constraints.billingCity?.required ? "true" : undefined}
						class={`w-full ${inputClass}`} 
					/>
					<span id="billingCity-error" aria-live="assertive">
						{#if $errors.billingCity?.length}
							{#each $errors.billingCity as err}
								<span class="text-red-600">{err}</span>
							{/each}
						{/if}
					</span>
				</div>
				<div class="col-span-1 p-2">
					<label for="billingProvince" class={labelClass}>State</label>
					<input 
						bind:value={$formData.billingProvince} 
						id="billingProvince"
						name="billingProvince"
						placeholder="State or Province" 
						type="text"
						aria-describedby={$errors.billingProvince ? "billingProvince-error" : undefined}
						aria-invalid={$errors.billingProvince ? "true" : undefined}
						aria-required={$constraints.billingProvince?.required ? "true" : undefined}
						class={`w-full ${inputClass}`} 
					/>
					<span id="billingProvince-error" aria-live="assertive">
						{#if $errors.billingProvince?.length}
							{#each $errors.billingProvince as err}
								<span class="text-red-600">{err}</span>
							{/each}
						{/if}
					</span>
				</div>
				<div class="col-span-1 p-2">
					<label for="billingCountry" class={labelClass}>Country</label>
					<input 
						bind:value={$formData.billingCountry} 
						id="billingCountry"
						name="billingCountry"
						placeholder="Country" 
						type="text"
						aria-describedby={$errors.billingCountry ? "billingCountry-error" : undefined}
						aria-invalid={$errors.billingCountry ? "true" : undefined}
						aria-required={$constraints.billingCountry?.required ? "true" : undefined}
						class={`w-full ${inputClass}`} 
					/>
					<span id="billingCountry-error" aria-live="assertive">
						{#if $errors.billingCountry?.length}
							{#each $errors.billingCountry as err}
								<span class="text-red-600">{err}</span>
							{/each}
						{/if}
					</span>
				</div>
				<div class="col-span-1 p-2">
					<label for="billingPostalCode" class={labelClass}>Zip code</label>
					<input 
						bind:value={$formData.billingPostalCode} 
						id="billingPostalCode"
						name="billingPostalCode"
						placeholder="Zip code" 
						type="text"
						aria-describedby={$errors.billingPostalCode ? "billingPostalCode-error" : undefined}
						aria-invalid={$errors.billingPostalCode ? "true" : undefined}
						aria-required={$constraints.billingPostalCode?.required ? "true" : undefined}
						class={`w-full ${inputClass}`} 
					/>
					<span id="billingPostalCode-error" aria-live="assertive">
						{#if $errors.billingPostalCode?.length}
							{#each $errors.billingPostalCode as err}
								<span class="text-red-600">{err}</span>
							{/each}
						{/if}
					</span>
				</div>
				<div class="col-span-2 p-2">
					<label for="billingPhoneNumber" class={labelClass}>Phone</label>
					<input 
						bind:value={$formData.billingPhoneNumber} 
						id="billingPhoneNumber"
						name="billingPhoneNumber"
						placeholder="Phone number" 
						type="text"
						aria-describedby={$errors.billingPhoneNumber ? "billingPhoneNumber-error" : undefined}
						aria-invalid={$errors.billingPhoneNumber ? "true" : undefined}
						aria-required={$constraints.billingPhoneNumber?.required ? "true" : undefined}
						class={`w-full ${inputClass}`} 
					/>
					<span id="billingPhoneNumber-error" aria-live="assertive">
						{#if $errors.billingPhoneNumber?.length}
							{#each $errors.billingPhoneNumber as err}
								<span class="text-red-600">{err}</span>
							{/each}
						{/if}
					</span>
				</div>
			{/if}
		</div>
	</div>
{/if}