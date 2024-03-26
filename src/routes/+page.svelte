<script lang="ts">
	import type { PageData } from './$types'
	import Carousel from '$lib/components/Carousel.svelte'
	import CarouselItem from '$lib/components/CarouselItem.svelte'
	import MetaTags from '$lib/components/MetaTags.svelte'
	export let data: PageData
	const slides = Array.from({ length: 10 }, (_, i) => ({ title: `${i + 1}` }));
	console.log(data)
</script>
<MetaTags />

<Carousel containerClass={'px-10'} {slides}>
	<CarouselItem slot="slide" let:slide {...slide} />

	<button
		slot="next"
		let:next
		let:canScrollNext
		class={`btn w-fit absolute right-0 top-0 bottom-0 my-auto ${
			!canScrollNext ? 'opacity-50 cursor-not-allowed' : ''
		}`}
		on:click={next}
		let:a11y
		{...a11y}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-6 h-6"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
		</svg>
	</button>
	<button
		slot="prev"
		let:prev
		let:canScrollPrev
		on:click={prev}
		class={`btn w-fit absolute left-0 top-0 bottom-0 my-auto ${
			!canScrollPrev ? 'opacity-50 !cursor-not-allowed' : ''
		}`}
		let:a11y
		{...a11y}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-6 h-6"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
		</svg>
	</button>
</Carousel>

<section class="flex items-center h-200 min-h-[60vh] p-8">
	<div class="my-auto mx-auto">
		<h1 class="text-2xl">Your Own Custom Home Page</h1>
	</div>
</section>
