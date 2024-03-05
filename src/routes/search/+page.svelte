<script lang="ts">
	import { getContextClient, queryStore } from '@urql/svelte'
	import { queryParam } from 'sveltekit-search-params'
	import { useFragment } from '$lib/gql'
	import { SearchResult, SearchProducts } from '$lib/vendure'
	import MetaTags from '$lib/components/MetaTags.svelte'
	import SearchHit from '$lib/components/SearchHit.svelte'

	const q = queryParam('q')
	let hits: any = []
	const client = getContextClient()
	$: resultStore = queryStore({ client, query: SearchProducts, variables: { input: { term: $q, take: 10, skip: 0, groupByProduct: true } }, pause: !$q })
	$: { if ($resultStore.data?.search?.items) hits = useFragment(SearchResult, $resultStore.data.search.items) }

	const handleClick = function(e: any) {
		$q = ''
		window.location.href = `/product/${e.detail}`
	}
</script>
<MetaTags title="Search" />
<div class="max-w-screen-2xl mx-auto my-8 px-6 md:px-8">
		<label for="q" class="sr-only">Search</label>
		<input type="search" bind:value={$q} class="w-full block py-3 px-4 text-sm border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500" aria-label="Search" />
	{#each hits as hit}
		<SearchHit {hit} on:click={handleClick} />
	{:else}
		{#if $q}
			<p>No results found.</p>
		{:else}
			<p>Enter a search term.</p>
		{/if}
	{/each}
</div>