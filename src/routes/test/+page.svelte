<script lang="ts">
	import type { PageData } from './$types'
	import { getContextClient, queryStore } from '@urql/svelte'
	import { type Dropin, create } from 'braintree-web-drop-in'
	import { setMessage, superForm } from 'sveltekit-superforms'
	// import { GooglePlacesAutocomplete } from 'sveltekit-google-places-autocomplete'
	import { zod } from 'sveltekit-superforms/adapters'
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'
	import { type FragmentType, useFragment } from '$lib/gql'
	import { cartStore, userStore } from '$lib/stores'
	import { braintreeCheckoutReq } from '$lib/validators'
	import { 
		ActiveOrder,
		GetActiveOrder, 
		Customer, 
		GetCustomer,
		SetOrderCustomer, 
		Address,
		GetCustomerAddresses,
		CreateCustomerAddress,
		SetOrderShippingAddress, 
		ShippingMethodQuote,
		GetOrderShippingMethods, 
		SetOrderShippingMethod, 
		TransitionOrderToState, 
		CreateStripePaymentIntent, 
		AddOrderCouponCode, 
		RemoveOrderCouponCode,
	} from '$lib/vendure'
	import GooglePlacesAutocomplete from '$lib/components/GooglePlacesAutocomplete.svelte'
	import { PUBLIC_GOOGLE_PLACES_API_KEY, PUBLIC_SITE_NAME } from '$env/static/public'

	export let data: PageData
	const authorization: string = data.authorization
	let dropin: Dropin
	// let disabled: boolean = true
	let disabled: boolean = false
	$: console.log(disabled)

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
	$: order = useFragment(ActiveOrder, $cartStore)
	$: customer = useFragment(Customer, $userStore)

	const handlePlaceChanged = async (e: CustomEvent) => {
		console.log(e.detail)
	}

	const renderDropin = async () => {
		dropin = await create({ 
			authorization, 
			container: '#dropin-container',
			// paypal: {
   		// 	flow: 'checkout',
			// 	amount: '10.00',
			// 	currency: 'USD'
  			// }
		})
	}

	const { form: formData, constraints, enhance, errors, message }  = superForm(data.form, { 
		SPA: true,
		validators: zod(braintreeCheckoutReq),
		onUpdate: async ({ form }) => {
			console.log(form.valid)
			console.log(form.data)
			console.log(form.errors)
			if (form.valid) {
				// const loginResult = await client.mutation(SignIn, { username: form.data.email.toLowerCase(), password: form.data.password, rememberMe: false }).toPromise()
				// if (loginResult?.data?.login?.__typename === 'CurrentUser') {
					
				// } else {
				// 	if (loginResult?.data?.login?.__typename === 'InvalidCredentialsError') {
				// 		setMessage(form, 'The email or password you entered is incorrect.')
				// 	} else if (loginResult?.data?.login?.__typename === 'NotVerifiedError') {
				// 		setMessage(form, 'Your account has not been verified. Please check your email for a verification link.')
				// 	} else {
				// 		setMessage(form, 'An unknown error occurred. Please try again.')
				// 	}
				// }
			}
		}
	})

	const validateAddress = (data: any) => {
		console.log(data)
		const { streetLine1, streetLine2, city, province, country, postalCode, phoneNumber } = data
		if (!streetLine1 || !city || !province || !country || !postalCode || !phoneNumber) {
			return false
		}
		return true
	}

	onMount(async () => {
		if (browser) {
			await updateStores()
			await renderDropin()
			if (dropin?.isPaymentMethodRequestable()) disabled = false
			dropin?.on('paymentMethodRequestable', event => {
				console.log('paymentMethodRequestable', event)
				disabled = false
			})
		}
	})
</script>
<noscript>
	<p>Please enable javascript to complete checkout.</p>
	<p>We use a third party (<a href="https://braintree.com">Braintree</a>) to process credit card payments for enhanced security.  Making payments on this site using Braintree requires javascript.</p>
</noscript>
<form method="POST" class="p-4" use:enhance>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 sm:gap-x-8">
		<div class="col-span-1 md:col-span-2 lg:col-span-3 px-4 py-6 sm:px-6">
			<h1 class="sr-only">Checkout</h1>
			<a href="/"><img src="/logo.png" class="mx-auto sm:m-0 h-14 w-auto" alt="{PUBLIC_SITE_NAME}" /></a>
		</div>
		<div class="col-span-1">
			<GooglePlacesAutocomplete 
				apiKey={PUBLIC_GOOGLE_PLACES_API_KEY} 
				form={data.form} 
				labelClass = 'text-sm'
				inputClass = 'p-3 rounded border-gray-400 ring-0 focus:ring-0 focus:border-gray-800'
				on:placeChanged={async (e) => await handlePlaceChanged(e)} 
			/>
		</div>
		<div class="col-span-1">
			<h3 class="text-lg font-medium text-gray-900 pb-6">Shipping</h3>
			<p class="mt-1 text-sm text-gray-500">Enter your location.</p>
		</div>
		<div class="col-span-1 hidden md:block lg:hidden" />
		<div class="col-span-1">
			<h3 class="text-lg font-medium text-gray-900">Payment Method</h3>
			<div id="dropin-container" />
			<div class="mt-6">
				<button type="submit" class="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled={disabled}>
					Place order
				</button>
			</div>
		</div>
	</div>
</form>