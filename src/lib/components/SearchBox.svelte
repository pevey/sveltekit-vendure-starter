<script lang="ts">
	import { Search } from 'lucide-svelte'
	import { getContextClient, queryStore } from '@urql/svelte'
	import { useFragment } from '$lib/gql'
	import { SearchResult, SearchProducts } from '$lib/vendure'
	import { clickOutside } from '$lib/utils'
	import SearchHit from '$lib/components/SearchHit.svelte'
	
	let q: string = ''
	let hits: any = []
	const client = getContextClient()
	$: resultStore = queryStore({ client, query: SearchProducts, variables: { input: { term: q, take: 10, skip: 0, groupByProduct: true } } })
	$: { if ($resultStore.data?.search?.items) hits = useFragment(SearchResult, $resultStore.data.search.items) }

	const handleClick = function(e: any) {
		q = ''
		window.location.href = `/product/${e.detail}`
	}
</script>
<div class="relative hidden md:block w-full max-w-xl mx-auto">
		<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
			<Search class="h-7 w-7 text-gray-700" />
		</div>
		<label for="q" class="sr-only">Search</label>
		<input type="search" placeholder="Search" bind:value={q} class="block w-full rounded-md border border-stone-300 py-3 pl-12 pr-3 leading-5 text-gray-700 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500" />
	{#if q}
	<div use:clickOutside on:clickOutside={() => q = ''} class="absolute overflow-auto max-h-[80vh] rounded-b-xl bg-white w-full z-50 border border-gray-200">
		{#each hits as hit}
			<SearchHit {hit} on:click={handleClick} />			
		{:else}
			<p>No results found.</p>
		{/each}
	</div>
	{/if}
</div>
<div class="md:hidden p-2 self-end ml-auto">
	<button type="button" class="align-middle items-center grow-on-hover">
		<a href="/search">
			<Search class="h-9 w-9 grow-on-hover" />
		</a>
	</button>
</div>