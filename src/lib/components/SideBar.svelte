<script lang="ts">
	import { X, Menu } from 'lucide-svelte'
	import { createDialog } from '@melt-ui/svelte'
	import { fade, fly } from 'svelte/transition'
	import { type FragmentType, useFragment } from '$lib/gql'
	import { Collection, Customer } from '$lib/vendure'
	import { userStore } from '$lib/stores'
	export let collections: FragmentType<typeof Collection>[]
	$: me = $userStore
	const { 
		elements: { trigger, portalled, overlay, content, close },
		states: { open, } 
	} = createDialog( { preventScroll: false } )
</script>
{#if $open}
	<button {...$close} use:close class="align-middle items-center grow-on-hover">
		<Menu class="h-9 w-9" />
	</button>
{:else}
	<button {...$trigger} use:trigger class="align-middle items-center grow-on-hover">
		<Menu class="h-9 w-9" />
	</button>
{/if}
<div use:portalled>
	{#if $open}
		<div {...$overlay} use:overlay class="fixed inset-0 z-20 bg-black/50" transition:fade={{ duration: 150 }} />
		<div {...$content} use:content class="overflow-auto fixed left-0 top-0 z-50 h-screen w-full max-w-[350px] bg-white dark:bg-black p-[25px] shadow-lg focus:outline-none" transition:fly={{ x: '-100%', duration: 300, opacity: 1, }}>
			<div class="flex flex-col justify-between h-full">
				<div>
					<div class="flex items-center mb-6">
						<a class="mr-auto text-2xl font-medium leading-none" href="/">
							<img class="h-16" src="/logo.svg" alt="" width="auto">
						</a>
						<button {...$close} use:close class="grow-on-hover">
							<X class="h-9 w-9" />
						</button>
					</div>
					<div class="flex flex-col">
						{#each useFragment(Collection, collections) as collection}
							<a href="/collection/{collection.slug}" class="py-3 px-3 mr-2 font-medium group transition-all duration-200 ease-in-out">
								<span class="py-2 bg-left-bottom bg-gradient-to-r from-lime-600 to-lime-600 bg-[length:0%_1px] bg-no-repeat group-hover:bg-[length:100%_1px] transition-all duration-500 ease-out">
									{collection.name}
								</span>
							</a>
						{/each}
						{#if me}
							<a href="/account" use:close class="py-2 px-3 mr-2 mt-12 rounded-md font-medium text-lg">Your Profile</a>
							<form action="/auth?/signOut" method="POST">
								<button type="submit" class="py-2 px-3 mr-2 rounded-md font-medium text-lg">Sign Out</button>
							</form>
						{:else}
							<a href="/auth" use:close class="py-2 px-3 mr-2 mt-12 rounded-md font-medium text-lg">Sign In</a>
						{/if}
					</div>
				</div>
				<div class="flex flex-col">
					1618 Marshall St, Ste. C<br>
					Shreveport, LA 71101
				</div>
			</div>
		</div>
	{/if}
</div>
