<script lang="ts">
	import type { Address as StripeAddress, StripeAddressElementOptions } from 'sveltekit-stripe'
	import { Elements, PaymentElement, AddressElement } from 'sveltekit-stripe'
	import { Turnstile } from 'sveltekit-turnstile'
	import { Truck, Warehouse } from 'lucide-svelte'
	import { getContextClient, queryStore } from '@urql/svelte'
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import { browser } from '$app/environment'
	import { type FragmentType, useFragment } from '$lib/gql'
	import type { CreateCustomerInput, CreateAddressInput } from '$lib/gql/graphql'
	import { cartStore, userStore } from '$lib/stores'
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
	import { 
		PUBLIC_DEFAULT_CURRENCY,
		PUBLIC_LOCAL_PICKUP_CODE,
		PUBLIC_SITE_NAME,
		PUBLIC_STRIPE_KEY,
		PUBLIC_STRIPE_REDIRECT_URL,
		PUBLIC_TURNSTILE_SITE_KEY,
	} from '$env/static/public'
	import { formatCurrency } from '$lib/utils'
	import CheckoutOrderSummary from '$lib/components/CheckoutOrderSummary.svelte'
	import MetaTags from '$lib/components/MetaTags.svelte'
    import { error } from '@sveltejs/kit';

	let token: string = ''
	if (!PUBLIC_TURNSTILE_SITE_KEY) token = Math.floor(Math.random() * 1000000).toString()
	let addressElementOptions: StripeAddressElementOptions = { mode: 'shipping' }
	let contacts: any[]
	let address: StripeAddress
	let emailAddress: string
	let firstName: string
	let lastName: string
	let shippingOptions: FragmentType<typeof ShippingMethodQuote>[]
	let selectedShippingOption: string
	let delivery: 'ship'|'pickup' = 'ship'
	let processing = false
	let errorMessage: string|undefined

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
		if (browser) {
			updateStores()
			if ($userStore) {
				const { emailAddress, firstName, lastName } = useFragment(Customer, $userStore)
				setCustomer({ emailAddress, firstName, lastName })
			}
		}
	})

	$: order = useFragment(ActiveOrder, $cartStore)
	$: customer = useFragment(Customer, $userStore)

	$: addressQuery = (customer)? queryStore({ client, query: GetCustomerAddresses, requestPolicy: 'network-only' }) : null
	$: if ($addressQuery?.data?.activeCustomer?.addresses) getContacts($addressQuery.data.activeCustomer.addresses)
	$: addresses = useFragment(Address, $addressQuery?.data?.activeCustomer?.addresses)
		
	$: if (browser && shippingOptions) setShippingOption(selectedShippingOption)

	const setCustomer = async (input: CreateCustomerInput) => {
		let result = await client.mutation(SetOrderCustomer, { input }).toPromise()
		console.log(result)
		if (result?.data?.setCustomerForOrder?.__typename === 'EmailAddressConflictError') {
			errorMessage = 'An account with that email address already exists.  Please sign in.'
		} else if (result?.data?.setCustomerForOrder?.__typename === 'Order') {
			errorMessage = ''
		}
	}

	const getContacts = (addressFragment: FragmentType<typeof Address>[]) => {
		const addresses = useFragment(Address, addressFragment)
		for (let address of addresses) {
			contacts.push({
				name: address.fullName,
				address: {
					line1: address.streetLine1,
					line2: address.streetLine2,
					city: address.city,
					state: address.province,
					postal_code: address.postalCode,
					country: address.country.code.toUpperCase(),
				}
			})
		}
		addressElementOptions.contacts = contacts
	}

	const setAddress = async (firstName: string, lastName: string, address: StripeAddress) => {
		let result = await client.mutation(SetOrderShippingAddress, { input: convertAddress(firstName, lastName, address) }).toPromise()
		console.log(result)
	}

	const saveNewAddress = async (firstName: string, lastName: string, address: StripeAddress) => {
		let vAddress = convertAddress(firstName, lastName, address)
		if (addresses?.length) {
			const existingAddress = addresses.find(v => v.streetLine1 === vAddress.streetLine1 && v.streetLine2 === vAddress.streetLine2 && v.city === vAddress.city && v.province === vAddress.province && v.postalCode === vAddress.postalCode)
			if (existingAddress) return
		}
		let result = client.mutation(CreateCustomerAddress, { input: vAddress }).toPromise()
		console.log(result)
	}

	const convertAddress = function (firstName: string, lastName: string, address: StripeAddress) {
		return {
			fullName: `${firstName} ${lastName}`,
			streetLine1: address.line1 || '', // TODO: Why does Vendure make line 1 optional and line 2 not?
			streetLine2: address.line2,
			city: address.city,
			province: address.state,
			postalCode: address.postal_code,
			countryCode: address.country || 'US' // Change fallback to your default country code or make sure all address in Vendure have country code
		} satisfies CreateAddressInput
	}

	const getShippingOptions = async () => {
		let result = await client.query(GetOrderShippingMethods, {}).toPromise()
		console.log(result)
		if (result?.data?.eligibleShippingMethods) shippingOptions = result.data.eligibleShippingMethods
	}

	const selectCheapestShippingOption = async () => {
		// set cheapest shipping option as default, but make sure it is not local pickup
		if (shippingOptions) {
			let index = 0
			if (PUBLIC_LOCAL_PICKUP_CODE) {
				let pickupIndex = useFragment(ShippingMethodQuote, shippingOptions).findIndex(v => v.code === PUBLIC_LOCAL_PICKUP_CODE)
				if (pickupIndex === index) index += 1
			}
			if (index === useFragment(ShippingMethodQuote, shippingOptions).length) {
				errorMessage = 'There are no shipping options available.'
			} else {
				selectedShippingOption = useFragment(ShippingMethodQuote, shippingOptions)[index].id
			}
		}
	}
	
	const selectPickupOption = async () => {
		if (shippingOptions) {
			let pickupIndex = useFragment(ShippingMethodQuote, shippingOptions).findIndex(v => v.code === PUBLIC_LOCAL_PICKUP_CODE)
			if (pickupIndex === -1) {
				errorMessage = 'Something went wrong while setting the shipping option to local pickup.'
			} else {
				selectedShippingOption = useFragment(ShippingMethodQuote, shippingOptions)[pickupIndex].id                    
			}
		}
	}

	const setShippingOption = async (id: string) => {
		let result = await client.mutation(SetOrderShippingMethod, { id }).toPromise()
		console.log(result)
	}

	const setOrderState = async (state: string) => {
		let result = await client.mutation(TransitionOrderToState, { state }).toPromise()
		console.log(result)
	}

	const startPayment = async () => {
		let result
		if (PUBLIC_TURNSTILE_SITE_KEY) {
			// let result = await client.mutation(CreateStripePaymentIntent, { token }).toPromise()
		} else {
			result = await client.mutation(CreateStripePaymentIntent, {}).toPromise()
		}
		console.log(result)
		return (result?.data?.createStripePaymentIntent)? result.data.createStripePaymentIntent : ''
	}
</script>
<!-- <MetaTags title="Checkout" description="Checkout page for {data.siteName}"/> -->
<noscript>
	<p>Please enable javascript to complete checkout.</p>
	<p>We use a third party (<a href="https://stripe.com">Stripe</a>) to process credit card payments for enhanced security.  Making payments on this site using Stripe requires javascript.</p>
</noscript>
<MetaTags title="Checkout" description="Checkout page for {PUBLIC_SITE_NAME}"/>
<!-- {#if $cartQuery.fetching}
	<p>Loading...</p>
{:else if !order?.lines} -->
{#if !order?.lines}
	<p>Your cart is empty.</p>
{:else if !token && PUBLIC_TURNSTILE_SITE_KEY}
	<Turnstile theme="light" siteKey={PUBLIC_TURNSTILE_SITE_KEY} on:turnstile-callback={ async (e) => { 
		token = e.detail.token
	}} />
{:else}
	<main class="lg:flex lg:min-h-full lg:flex-row-reverse lg:max-h-screen lg:overflow-hidden">
		<!-- Logo on sm screen -->
		<div class="px-4 py-6 sm:px-6 lg:hidden">
			<div class="mx-auto flex max-w-lg">
				<h1 class="sr-only">Checkout</h1>
				<a href="/"><img src="/logo.png" class="mx-auto h-14 w-auto" alt="{PUBLIC_SITE_NAME}" /></a>
			</div>
		</div>
		<CheckoutOrderSummary currency={PUBLIC_DEFAULT_CURRENCY} />
		<section aria-labelledby="payment-heading" class="flex-auto px-4 pb-16 pt-6 sm:pt-8 sm:px-6 lg:px-8 lg:pb-4 overflow-auto">
			<div class="mx-auto max-w-lg">
				<!-- Logo on lg screen -->
				<div class="hidden py-10 lg:flex">
					<h1 class="sr-only">Checkout</h1>
					<a href="/"><img src="/logo.png" alt="{PUBLIC_SITE_NAME}" class="h-14 w-auto"></a>
				</div>
				<!-- Checkout Form -->
				<Elements publicKey={PUBLIC_STRIPE_KEY} let:stripe let:elements elementsOptions={{ 
					appearance: { 
						theme: 'stripe',
					},
					mode: 'payment',
					currency: PUBLIC_DEFAULT_CURRENCY.toLowerCase(),
					amount: order.total
				}}>
					<form class="grid gap-y-8" method="POST" use:enhance={ async ({ cancel }) => {
						if (processing) cancel()
						processing = true
						try {
							if (!customer) {
								// save guest customer
								if (!emailAddress || !firstName || !lastName) errorMessage = 'Please complete all fields.'
								else await setCustomer({ emailAddress, firstName, lastName })
								if (errorMessage) { processing = false;  cancel() }
							} else {
								// this will try to save the address for existing customer if it is new address
								await saveNewAddress(firstName, lastName, address)
							}
						} catch {
							errorMessage = 'Something went wrong while saving customer.'
							processing = false
							cancel()
						}
						try {
							await setOrderState('ArrangingPayment')
							const clientSecret = await startPayment()
							let stripeResponse = await elements?.submit()
							if (stripeResponse && !stripeResponse.error) {
								// TODO: save payment method
								stripeResponse = await stripe?.confirmPayment({ 
									elements,
									clientSecret, 
									confirmParams: { return_url: `${PUBLIC_STRIPE_REDIRECT_URL}/${order?.code}` }
								})
								console.log(stripeResponse)
							}
						} catch {
							await setOrderState('AddingItems')
							errorMessage = 'Something went wrong when connecting to our payment provider.'
							processing = false
							cancel()
						}
					}}>
						{#if errorMessage}
							<p class="text-red-600 text-lg font-semibold">{errorMessage}</p>
						{/if}
						<section id="email">
							<div class="flex flex-auto justify-between items-center">
								<h3 class="text-xl font-medium text-gray-900" id="payment-heading">Email</h3>
								<span class="text-sm">
									{#if (!customer)}
										Have an account? Sign in
									{:else}
										Sign in as a different customer
									{/if}
								</span>
							</div>
							{#if customer}
								<div>{customer.emailAddress}</div>
							{:else}
								<input name="emailAddress" bind:value={emailAddress} on:change={ async () => { await setCustomer({ emailAddress, firstName: '', lastName: '' }) } } type="text" class="input mt-2">
								<div class="mt-2 flex items-center">
									<input name="offers" id="offers" type="checkbox" class="checkbox"> 
									Send me emails with news and offers
								</div>
							{/if}
						</section>
						<section id="address">
							<h3 class="mb-3 text-xl font-medium text-gray-900" id="payment-heading">Address</h3>
							<AddressElement {addressElementOptions} 
								on:complete={async (e) => {
									firstName = e.detail.firstName
									lastName = e.detail.lastName
									if (address !== e.detail.address) {
										address = e.detail.address
										await setAddress(firstName, lastName, address)
										await getShippingOptions()
										if (!shippingOptions) {
											errorMessage = 'Something went wrong while getting shipping options.'
										} else {
											if (delivery === 'ship')  await selectCheapestShippingOption() 
											else if (delivery === 'pickup') await selectPickupOption()
										}
									}
								}}
							/>
						</section>
						{#if PUBLIC_LOCAL_PICKUP_CODE}
							<section id="delivery">
								<h3 class="mb-3 text-xl font-medium text-gray-900" id="payment-heading">Delivery</h3>
								<div role="radiogroup" class="rounded-md overflow-hidden border">
									<label class={
										(delivery === 'ship')
										? "w-full flex items-center p-4 rounded-t-md border-2 border-violet-600" 
										: "w-full flex items-center p-4"
									}>
										<input 
											type="radio" 
											name="delivery" 
											value="ship" 
											class="focus:ring-0 text-violet-600"
											checked={delivery === 'ship'} 
											on:change={ async () => { 
												delivery = 'ship'
												await selectCheapestShippingOption()
											}} 
										/>
										<span class="ml-3">Ship</span>
										<Truck class="ml-auto" />
									</label>
									<label class={
										(delivery === 'pickup')
										? "w-full flex items-center p-4 rounded-b-md border-2 border-violet-500" 
										: "w-full flex items-center p-4"
									}>
										<input 
											type="radio" 
											name="delivery" 
											value="pickup" 
											class="focus:ring-0 text-violet-600"
											checked={delivery === 'pickup'} 
											on:change={ async () => { 
												delivery = 'pickup' 
												await selectPickupOption()
											}} 
										/>
										<span class="ml-3">Pick Up</span>
										<Warehouse class="ml-auto" />
									</label>
								</div>
							</section>
						{/if}
						<!-- Shipping Method -->
						{#if delivery === 'ship' && shippingOptions}
						<section id="shipping-method">
							<h3 class="mb-3 text-xl font-medium text-gray-900" id="payment-heading">Shipping Method</h3>
							<select bind:value={selectedShippingOption} required class="block w-full rounded-md border-gray-200 focus:border-2 focus:border-violet-600 text-gray-600 py-3">
								{#each useFragment(ShippingMethodQuote, shippingOptions) as shippingOption}
									<option value={shippingOption.id}>{shippingOption.name} {formatCurrency(shippingOption.price, PUBLIC_DEFAULT_CURRENCY)}</option>
								{:else}
									No shipping options available
								{/each}
							</select>
						</section>
						{:else}
							Enter name and address above to see shipping getOptions.
						{/if}
						<!-- Payment -->
						<section id="payment">
							<h3 class="mb-3 text-xl font-medium text-gray-900" id="payment-heading">Payment</h3>
							<PaymentElement />
						</section>
						{#if errorMessage}
							<p class="text-red-600 text-lg font-semibold">{errorMessage}</p>
						{/if}
						<!-- Submission -->         
						<button disabled={processing} type="submit" class="w-full items-center justify-center rounded-md border border-transparent bg-lime-600 px-5 py-3 text-base font-medium text-white hover:bg-lime-700">
							{#if processing} Processing...{:else} Complete Your Order {/if}
						</button>
						<p class="flex justify-center pb-4 text-sm font-medium text-gray-500">
							<svg class="mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
							</svg>
							Payments processed securely by Stripe
						</p>
					</form>
			</Elements>
			</div>
		</section>
	</main>
{/if}