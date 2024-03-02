<script lang="ts">
	import { type FragmentType, useFragment } from '$lib/gql'
	import { Collection, Customer, ActiveOrder } from '$lib/vendure'
	import { cart } from '$lib/stores'
	import Cart from '$lib/components/Cart.svelte'
	import Account from '$src/lib/components/Account.svelte'
	import SearchBox from '$lib/components/SearchBox.svelte'
	import SideBar from '$lib/components/SideBar.svelte'
	import ThemeSwitcher from './ThemeSwitcher.svelte'
	export let collections: FragmentType<typeof Collection>[]
	// export let customer: FragmentType<typeof Customer>|null
	// export let order: FragmentType<typeof ActiveOrder>|null
	// export let count: number = 0
	$: order = $cart
	$: count = useFragment(ActiveOrder, $cart)?.lines?.length || 0
</script>
<nav class="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 bg-transparent">
	<div class="flex flex-grow items-center justify-between mt-3">
		<div class="flex flex-none items-center">
			<a class="inline-block text-3xl font-bold" href="/">
				<img class="block h-14 w-auto md:hidden" src="/logo.png" alt="Louisiana Roasting Company">
				<img class="hidden h-auto w-auto md:block" src="/logo.png" alt="Louisiana Roasting Company">
			</a>
			<div class="hidden lg:block mr-auto lg:ml-6">
				{#each useFragment(Collection, collections) as collection}
					<a href="/collection/{collection.slug}" class="py-2 px-3 mr-2 rounded-md font-medium text-lg lg:hover:bg-stone-200">{collection.name}</a>
				{:else}
					Error: No collections found
				{/each}
			</div>
		</div>
		<div class="flex flex-grow align-middle items-center justify-between ml-4">
			<SearchBox />
		</div>
		<div class="flex flex-none relative align-middle justify-end lg:ml-4">
			<div>  
				<ThemeSwitcher />			
			</div>
			<div>
				<Cart />
			</div>
			<div class="hidden md:block">
				<Account />
			</div>
			<div class="lg:hidden">
				<SideBar {collections} />
			</div>
		</div>
	</div>
</nav>