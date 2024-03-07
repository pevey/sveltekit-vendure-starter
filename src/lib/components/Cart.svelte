<script lang="ts">
	import { X, ShoppingBag } from 'lucide-svelte'
	import { createDialog } from '@melt-ui/svelte'
   import { getContextClient } from '@urql/svelte'
	import { toast } from 'svoast'
	import { fade, fly } from 'svelte/transition'
	import { useFragment } from '$lib/gql'
	import { ActiveOrder, AdjustOrderLine, RemoveOrderLine } from '$lib/vendure'
	import { cartStore } from '$lib/stores'
	import { formatCurrency } from '$lib/utils'
	import VendureAsset from '$lib/components/VendureAsset.svelte'
	import { PUBLIC_DEFAULT_CURRENCY } from '$env/static/public'

	$: lines = useFragment(ActiveOrder, $cartStore)?.lines || []
	$: total = useFragment(ActiveOrder, $cartStore)?.subTotal || 0
	$: count = lines.length
	
	const client = getContextClient()
	let processing = false
	
	const adjustOrderLine = async (orderLineId: string, e: Event) => {
		if (processing) return
		processing = true
		const target = e.target as HTMLSelectElement
		const quantity = +target.value
		const result = await client.mutation(AdjustOrderLine, { orderLineId: orderLineId, quantity: quantity }, { additionalTypenames: ['ActiveOrder'] }).toPromise()
		if (result.error) toast.error('Error updating cart')
		else if (result.data) toast.success('Cart updated')
		processing = false
	}

	const removeOrderLine = async (orderLineId: string) => {
		if (processing) return
		processing = true
		const result = await client.mutation(RemoveOrderLine, { orderLineId: orderLineId }, { additionalTypenames: ['ActiveOrder'] }).toPromise()
		if (result.error) toast.error('Error removing item from cart')
		else if (result.data) toast.success('Item removed from cart')
		processing = false
	}

	const { 
		elements: { trigger, portalled, overlay, content, title, close },
		states: { open, } 
	} = createDialog( { preventScroll: true } )
</script>
{#if $open}
	<button {...$close} use:close class="relative align-middle items-center grow-on-hover">
		<span class="sr-only">Close cart</span>
		<ShoppingBag class="h-9 w-9" />
		{#if count > 0}
			<span class="z-50 absolute top-3 right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-lime-600 rounded-full">
				{count}
			</span>
		{/if}
	</button>
{:else}
	<button {...$trigger} use:trigger class="relative align-middle items-center grow-on-hover">
		<span class="sr-only">View cart</span>
		<ShoppingBag class="h-9 w-9" />
		{#if count > 0}
			<span class="z-50 absolute top-3 right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-lime-600 rounded-full">
				{count}
			</span>
		{/if}
	</button>
{/if}
<div use:portalled>
	{#if $open}
		<div {...$overlay} use:overlay class="fixed inset-0 z-20 bg-black/50" transition:fade={{ duration: 150 }} />
		<div {...$content} use:content class="overflow-auto fixed right-0 top-0 z-50 w-full h-full pb-0 mb-0 sm:w-4/5 md:w-2/3 lg:w-2/3 xl:w-1/2 bg-white dark:bg-black p-[25px] shadow-lg focus:outline-none" transition:fly={{ x: '100%', duration: 300, opacity: 1, }}>
			<button {...$close} use:close>
				<X class="h-10 w-10" />
			</button>
			<div class="px-8 sm:px-12">
				<h2 {...$title} use:title class="mb-6 text-center text-3xl font-bold tracking-tight sm:text-4xl">
					Shopping Cart
				</h2>
				<ul role="list" class="divide-y divide-gray-200 dark:divide-gray-800 border-t border-gray-200 dark:border-gray-800">
					{#each lines as line}
						<li class="flex py-6">
							<a data-sveltekit-reload href={`/product/${line.productVariant?.product?.slug}?variant=${line.productVariant.id}`} >
								<div class="cursor-pointer flex-shrink-0">
									{#if line.featuredAsset?.preview}
										<VendureAsset preview={line.featuredAsset.preview} alt={line.productVariant.name} preset="thumb" class="h-24 w-auto rounded-md object-cover object-center sm:h-32 sm:w-auto" />
									{:else}
										<img src="/img/noimg.png" alt={line.productVariant.name} class="h-24 w-auto rounded-md object-cover object-center sm:h-32 sm:w-auto">
									{/if}
								</div>
							</a>
							<div class="m-2 flex flex-1 flex-col sm:ml-6">
								<div>
									<div class="flex justify-between">
										<a data-sveltekit-reload href={`/product/${line.productVariant?.product?.slug}?variant=${line.productVariant.id}`} class="cursor-pointer text-sm">
											<div class="font-medium hover:text-gray-800">{line.productVariant.name}</div>
											<p class="mt-1 text-sm">Facet Values will go here</p>
										</a>
										<div>
											<p class="ml-4 text-sm font-medium">{formatCurrency(line.linePrice, PUBLIC_DEFAULT_CURRENCY)}</p>
											<p class="ml-4 text-sm text-right">Qty: {line.quantity}</p>
										</div>
									</div>
								</div>
								<div class="mt-4 flex flex-1 items-end justify-between">
									<select name="quantity" class="text-sm font-medium rounded-lg focus:ring-gray-700 focus:border-none text-black" on:change="{async(e) => adjustOrderLine(line.id, e)}">
										{#each [1,2,3,4,5,6,7,8,9,10,11,12] as qty}
											<option value={qty} selected={qty === line.quantity} class="text-sm text-black">{qty}</option>
										{/each}
									</select>
									<div class="ml-4">
										<button type="submit" on:click|preventDefault={ async () => { removeOrderLine(line.id) }} class="text-sm font-medium text-gray-500 hover:text-gray-400">
											<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
												<path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
											</svg>
										</button>                                        
									</div>
								</div>
							</div>
						</li>
					{:else}
						<div class="my-6">
							Cart is empty
						</div>
					{/each}
				</ul>
				<section aria-labelledby="summary-heading" class="border-t border-gray-200 dark:border-gray-800  bg-white dark:bg-black sticky bottom-0 py-6">
					{#if lines.length > 0}
					<h2 id="summary-heading" class="sr-only">Order summary</h2>
					<div>
						<dl class="space-y-4">
							<div class="flex items-center justify-between">
								<dt class="ml-2 text-base font-medium">Subtotal</dt>
								<dd class="ml-4 mr-2 text-base font-medium">{formatCurrency(total, PUBLIC_DEFAULT_CURRENCY)}</dd>
							</div>
						</dl>
						<p class="ml-2 mt-1 text-sm">Shipping and taxes will be calculated at checkout.</p>
					</div>
					<form action="/checkout">
						<button use:close type="submit" class="my-4 w-full items-center justify-center rounded-md border border-transparent bg-lime-600 px-5 py-3 text-base font-medium text-white hover:bg-lime-700">Checkout</button>
					</form>
					{/if}
					<button {...$close} use:close class="w-full text-center font-medium text-gray-800 hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-500">
						&larr; Continue Shopping
					</button>
				</section>
			</div>         
		</div>
	{/if}
</div>
