<script lang="ts">
	import { type FragmentType, useFragment } from '$lib/gql'
	import VendureAsset from '$lib/components/VendureAsset.svelte'
	import { Asset } from '$lib/vendure'
	export let assets: FragmentType<typeof Asset>[] = []
	$: images = useFragment(Asset, assets)
	$: selectedImage = images[0]?.preview || '/img/noimg.png'
	function selectImage(index: number) {
		selectedImage = images[index].preview
	}
</script>
<div class="grid grid-cols-1 w-full">
	<!-- Image display -->
	<div class="w-full">
		<VendureAsset preview={selectedImage} preset="large" alt="selected image" class="max-h-[50vh] w-full object-cover rounded-md sm:rounded-lg overflow-hidden" />
	</div>
	<!-- Image selector -->
	<div class="w-full mt-6 hidden max-w-2xl sm:block lg:max-w-none">
		<div class="grid grid-cols-4 gap-6" aria-orientation="horizontal" role="tablist">
			{#if images && images.length > 1}
				{#each images as image, i}
					<button on:click={() => { selectImage(i) }} class="ring-lime-600 relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4" aria-controls="tabs-1-panel-1" role="tab" type="button">
						<span class="absolute inset-0 overflow-hidden rounded-md">
							<VendureAsset preview={image.preview} preset="thumb" alt={`Preview image ${i}`} class="h-full w-full object-cover object-center"/>
						</span>
					</button>
				{/each}
			{/if}
		</div>
	</div>
</div>