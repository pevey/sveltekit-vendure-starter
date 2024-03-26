<!-- From svelte-light-carousel, by @beynar, https://github.com/beynar/svelte-light-carousel -->
<script lang="ts">
	type Slide = $$Generic;
	type ButtonsA11y = {
		a11y: {
			'aria-controls': string;
			'aria-label': string;
		};
	};
	type DotsA11y = {
		role: string;
		'aria-label': string;
	};
	type $$Slots = {
		slide: {
			slide: Slide;
			inView: boolean;
			index: number;
		};
		pagination: {
			canScrollPrev: boolean;
			prev: typeof prev;
			canScrollNext: boolean;
			next: typeof next;
			nextA11y: ButtonsA11y['a11y'];
			prevA11y: ButtonsA11y['a11y'];
		};
		prev: {
			canScrollPrev: boolean;
			prev: typeof prev;
		} & ButtonsA11y;
		next: {
			canScrollNext: boolean;
			next: typeof next;
		} & ButtonsA11y;
		progress: {
			progress: number;
			scrollTo: typeof scrollProgress;
		};
		dots: {
			dots: Dot[];
			a11y: DotsA11y;
			scrollTo: typeof scrollDot;
		};
	};

	const getSize = () => {
		const width = window.innerWidth;
		if (width < 640) return 'xs';
		if (width < 768) return 'sm';
		if (width < 1024) return 'md';
		if (width < 1280) return 'lg';
		return 'xl';
	};

	type Sizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'default';
	type ResponsiveProperty<T = number> = Partial<Record<Sizes, T>>;
	type DotA11y = {
		'aria-controls': string;
		'aria-label': string;
		role: 'tab';
		id: string;
		'aria-selected': boolean;
		tabIndex?: number;
	};
	type Dot = { active: boolean; a11y: DotA11y };
	interface DragScrollParameters {
		enabled?: boolean;
		oneAtTime?: boolean;
		pauseOnHover?: boolean;
		dragFree?: boolean;
		autoPlay?: number;
		axis?: { [S in Sizes]?: 'x' | 'y' };
		layout: { [S in Sizes]?: number };
		onInit: (event: OnInitEvent) => void;
		partialDelta?: { [S in Sizes]?: number };
		autoHeight?: boolean;
		id: string;
		onChange: (event: OnChangeEvent) => void;
	}

	type OnInitEvent = {
		navigate: (slide: number) => void;
		scrollTo: (slide: number) => void;
	};
	type OnChangeEvent = {
		currentSlide: number;
		progress: number;
		slidesInView: number[];
		dots: Dot[];
		canScrollNext: boolean;
		canScrollPrev: boolean;
	};

	const dragScroll = (
		node: HTMLElement,
		{
			id,
			oneAtTime = false,
			layout,
			axis = { default: 'x' },
			enabled = true,
			partialDelta,
			dragFree,
			pauseOnHover,
			autoHeight,
			autoPlay,
			onInit,
			onChange
		}: DragScrollParameters
	) => {
		const getCurrentSlide = () => {
			if (currentAxis === 'x') {
				if (node.scrollLeft < slideWidth / 2) {
					return 0;
				}
				if (node.scrollLeft > node.scrollWidth - node.clientWidth - slideWidth / 2) {
					return slideCount - slidesPerView;
				}
				return Math.ceil((node.scrollLeft - slideWidth / 3) / slideWidth);
			} else {
				return Math.floor(node.scrollTop / slideHeight);
			}
		};

		const emitChange = () => {
			currentSlide = getCurrentSlide();
			onChange({
				canScrollNext: currentSlide < slideCount - 1,
				canScrollPrev: currentSlide > 0,
				currentSlide,
				progress: (node.scrollLeft / (node.scrollWidth - node.clientWidth)) * 100,
				dots: Array.from({ length: slideCount - (slidesPerView - 1) }, (_, index) => ({
					active: index === currentSlide,
					a11y: {
						'aria-controls': `${id}-slide-${index + 1}`,
						'aria-label': `Slide ${index + 1}`,
						'aria-selected': index === currentSlide,
						id: `${id}-tab-${index + 1}`,
						role: 'tab',
						tabIndex: index === currentSlide ? undefined : -1
					}
				})),
				slidesInView: Array.from({ length: slideCount }, (_, i) => i).filter(
					(slide) => slide >= currentSlide && slide < currentSlide + slidesPerView
				)
			});
			if (mouseTargetedSlide) {
				mouseTargetedSlide.style.pointerEvents = 'auto';
			}
			if (!autoPlayPaused) {
				startPlay();
			}
		};
		const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);
		let currentAxis: 'x' | 'y' = axis?.[getSize()] ?? axis?.['default'] ?? 'x';
		let isDown = false;
		let startTime: number;
		let startScroll: number;
		let startX: number;
		let startY: number;
		let currentX: number;
		let currentY: number;
		let slideCount: number;
		let slidesPerView: number;
		let ongoingAnimation = false;
		let slideWidth = (node.firstChild as HTMLElement)?.clientWidth;
		let slideHeight = (node.firstChild as HTMLElement)?.clientHeight;
		let currentSlide: number = getCurrentSlide();
		let mouseTargetedSlide: HTMLElement | undefined;
		let autoPlayTimeout: any;
		let autoPlayPaused: boolean;

		const startPlay = () => {
			if (autoPlay) {
				if (autoPlayTimeout) {
					clearInterval(autoPlayTimeout);
				}
				autoPlayTimeout = setInterval(() => {
					if (currentSlide + slidesPerView - 1 < slideCount - 1) {
						scrollTo(currentSlide + 1);
					} else {
						scrollTo(0);
					}
				}, autoPlay * 1000);
			}
		};

		const pauseAutoPlay = () => {
			if (autoPlayTimeout) {
				autoPlayPaused = true;
				clearInterval(autoPlayTimeout);
			}
		};
		const resumePlay = () => {
			if (autoPlayPaused) {
				autoPlayPaused = false;
				startPlay();
			}
		};

		const handleMouseDown = (e: PointerEvent | MouseEvent) => {
			isDown = true;
			node.setAttribute('data-dragging', 'true');
			startTime = Date.now();
			mouseTargetedSlide = e.composedPath().find((el) => {
				return !!(el as HTMLElement).dataset?.['carouselSlide'];
			}) as HTMLElement | undefined;

			startX = e.pageX - node.offsetLeft;
			startY = e.pageY - node.offsetTop;
			startScroll = currentAxis === 'x' ? node.scrollLeft : node.scrollTop;

			window.addEventListener('mouseup', handleMouseUpAndLeave);
			window.addEventListener('mousemove', handleMouseMove);
		};

		const handleMouseMove = (e: PointerEvent | MouseEvent) => {
			if (isDown) {
				e.preventDefault();
				if (currentAxis === 'x') {
					currentX = e.pageX - node.offsetLeft;
					node.scrollLeft = startScroll - (currentX - startX);
				} else {
					currentY = e.pageY - node.offsetTop;
					node.scrollTop = startScroll - (currentY - startY);
				}

				if (mouseTargetedSlide) {
					const distanceX = Math.abs(currentX - startX);
					const distanceY = Math.abs(currentY - startY);
					if (distanceX > 10 || distanceY > 10) {
						mouseTargetedSlide.style.pointerEvents = 'none';
					}
				}
			}
		};
		const navigate = (slide: number) => {
			if (currentAxis === 'x') {
				const targetLeft = slide * slideWidth;
				node.scrollLeft = targetLeft;
			} else {
				const targetTop = slide * slideHeight + slide;
				node.scrollTop = targetTop;
			}
		};
		const scrollTo = (slide: number) => {
			if (currentAxis === 'x') {
				let targetLeft = slide * slideWidth;
				if (targetLeft > node.scrollWidth - node.clientWidth) {
					targetLeft = node.scrollWidth - node.clientWidth;
				}

				if (targetLeft < 0) {
					targetLeft = 0;
				}
				if (!ongoingAnimation) {
					ongoingAnimation = true;
					if (targetLeft < slideWidth / 2) {
						animation(node.scrollLeft, 0);
						// emitChange(slide);
					} else if (targetLeft > node.scrollWidth - node.clientWidth) {
						animation(node.scrollLeft, node.scrollWidth);
						// emitChange(slide);
					} else {
						animation(node.scrollLeft, targetLeft);
						// emitChange(slide);
					}
				} else {
					emitChange();
				}
			} else {
				let targetTop = slide * slideHeight + slide;

				if (targetTop > node.scrollHeight - node.clientHeight) {
					targetTop = node.scrollHeight - node.clientHeight;
				}

				if (targetTop < 0) {
					targetTop = 0;
				}
				if (!ongoingAnimation) {
					ongoingAnimation = true;
					if (targetTop < slideHeight / 2) {
						animation(node.scrollTop, 0);
					} else if (targetTop > node.scrollHeight - node.clientHeight) {
						animation(node.scrollTop, node.scrollHeight);
					} else {
						animation(node.scrollTop, targetTop);
					}
				} else {
					emitChange();
				}
			}
		};

		const handleMouseUpAndLeave = (e: MouseEvent) => {
			const endTime = Date.now();
			currentX = e.pageX - node.offsetLeft;
			currentY = e.pageY - node.offsetTop;
			const time = endTime - startTime;
			const distanceX = Math.abs(currentX - startX);
			const distanceY = Math.abs(currentY - startY);

			if (currentAxis === 'x') {
				if (distanceX > 10 && distanceX > distanceY) {
					const speedX = distanceX / time;
					const direction = startX > currentX ? 1 : -1;
					const multiplier = Math.ceil(Math.min(Math.max(Math.pow(speedX, 0.5), 0), 3));
					const computedDistance =
						(distanceX * multiplier) / (dragFree ? 1 : slideWidth - slideWidth / 4);

					let deltaSlide =
						direction === -1 ? Math.ceil(computedDistance) : Math.round(computedDistance);

					if (oneAtTime && deltaSlide > 1) {
						deltaSlide = 1;
					}

					if (!dragFree) {
						scrollTo(currentSlide + deltaSlide * direction);
					} else {
						animation(node.scrollLeft, node.scrollLeft + computedDistance * direction);
					}
				}
			} else {
				if (distanceY > 10 && distanceY > distanceX) {
					const speedY = distanceY / time;
					const direction = startY > currentY ? 1 : -1;
					const multiplier = Math.ceil(Math.min(Math.max(Math.pow(speedY, 0.5), 0), 3));
					const computedDistance = (distanceY * multiplier) / (dragFree ? 1 : slideHeight);

					let deltaSlide =
						direction === -1 ? Math.ceil(computedDistance) : Math.round(computedDistance);

					if (oneAtTime && deltaSlide > 1) {
						deltaSlide = 1;
					}

					if (!dragFree) {
						scrollTo(currentSlide + deltaSlide * direction);
					} else {
						animation(node.scrollTop, node.scrollTop + computedDistance * direction);
					}
				}
			}
			isDown = false;
			window.removeEventListener('mouseup', handleMouseUpAndLeave);
			window.removeEventListener('mousemove', handleMouseMove);
		};

		function easeOutCubic(t: number): number {
			return 1 - Math.pow(1 - t, 3.5);
		}

		const animation = (start: number, target: number, duration = 1) => {
			const lerp = (start: number, end: number, time: number, r = easeOutCubic(time)) =>
				start * (1 - r) + end * r;

			const frames = duration * 60; // number of frames during duration (at 60 fps)
			let time = 0;
			const step = 1 / frames;
			const animateScroll = () => {
				if (currentAxis === 'x') {
					node.scrollLeft = lerp(start, target, time);
				} else {
					node.scrollTop = lerp(start, target, time);
				}
				time += step;
				if (time < 1) {
					requestAnimationFrame(animateScroll);
				} else {
					if (currentAxis === 'x') {
						node.scrollLeft = target;
					} else {
						node.scrollTop = target;
					}
					node.setAttribute('data-dragging', 'false');

					setTimeout(() => {
						ongoingAnimation = false;
					}, 110);

					emitChange();
				}
			};
			requestAnimationFrame(animateScroll);
		};

		const init = () => {
			slideCount = node.childElementCount;
			if (autoHeight) {
				node.style.transform = 'unset';
			}
			slideWidth = (node.firstChild as HTMLElement)?.clientWidth;
			slideHeight = (node.firstChild as HTMLElement)?.clientHeight;
			slidesPerView = layout?.[getSize()] ?? layout?.['default'] ?? 1;
			currentAxis = axis?.[getSize()] ?? axis?.['default'] ?? 'x';
			if (autoHeight && currentAxis === 'y') {
				const delta = partialDelta?.[getSize()] ?? partialDelta?.['default'] ?? 0;
				node.style.height = slideHeight * slidesPerView + delta + 'px';
			}
			onInit({
				navigate,
				scrollTo
			});
			emitChange();
		};
		window.addEventListener('resize', () => {
			init();
			if (currentAxis === 'x') {
				node.scrollLeft = currentSlide * slideWidth + currentSlide;
			} else {
				node.scrollTop = currentSlide * slideHeight + currentSlide;
			}
		});

		const onScroll = () => {
			if (!isDown && !ongoingAnimation) {
				emitChange();
			}
		};
		const addEvents = ({ autoPlay, pauseOnHover }: { autoPlay?: number; pauseOnHover?: boolean }) => {
			if (!isMobile) {
				node.addEventListener('mousedown', handleMouseDown);
			}
			if (autoPlay && pauseOnHover) {
				node.addEventListener('pointerenter', pauseAutoPlay);
				node.addEventListener('pointerleave', resumePlay);
			}
			node.addEventListener('scroll', onScroll);
		};

		const removeEvents = () => node.removeEventListener('mousedown', handleMouseDown);

		init();
		enabled && addEvents({ autoPlay, pauseOnHover });
		return {
			update(update: Partial<DragScrollParameters> = {}) {
				removeEvents();
				if (update.enabled)
					addEvents({
						autoPlay: update.autoPlay,
						pauseOnHover: update.pauseOnHover
					});
				else removeEvents();
				init();
				if (autoPlayTimeout && !autoPlay) {
					clearInterval(autoPlayTimeout);
				}
			},
			destroy: removeEvents
		};
	};

	export let id = 'carousel' + Math.random().toString(36).substring(2, 9);
	export let slides: Slide[] = [];
	export let withGrabCursor: boolean = true;
	export let key: keyof Slide | undefined = undefined;
	export let axis: ResponsiveProperty<'x' | 'y'> = { default: 'x' };
	export let dragFree: boolean = false;
	export let disableNativeScroll: ResponsiveProperty<boolean> = {
		default: false
	};
	export let oneAtTime: boolean = false;
	export let autoHeight: boolean = true;
	export let autoPlay: number = 0;
	export let pauseOnHover: boolean = false;
	export let layout: ResponsiveProperty = {
		default: 1
	};
	export let gap: ResponsiveProperty = {
		default: 20
	};
	export let partialDelta: ResponsiveProperty = {
		default: 0
	};
	export let containerClass: string = '';
	export let slideClass: string = '';

	let slidesInView: number[] = [];
	let dots: Dot[] = [];
	let canScrollNext = false;
	let canScrollPrev = false;
	let progress: number = 0;
	let currentSlide: number = 0;
	let mounted: boolean = false;

	let scrollTo: (slide: number) => void;
	let navigate: (slide: number) => void;

	const next = () => canScrollNext && navigate(currentSlide + 1);
	const prev = () => canScrollPrev && navigate(currentSlide - 1);

	const onInit = (event: OnInitEvent) => {
		scrollTo = event.scrollTo;
		navigate = event.navigate;
		mounted = true;
	};

	const onChange = (event: OnChangeEvent) => {
		progress = event.progress;
		slidesInView = event.slidesInView;
		dots = event.dots;
		canScrollNext = event.canScrollNext;
		canScrollPrev = event.canScrollPrev;
		currentSlide = event.currentSlide;
	};

	const scrollProgress = (e: PointerEvent) => {
		const track = e.currentTarget;
		if (track instanceof HTMLElement) {
			const pointerPositionOnTrackInPercent =
				(e.clientX - track.getBoundingClientRect().left) / track.clientWidth;
			navigate(Math.floor(pointerPositionOnTrackInPercent * slides.length));
		}
	};
	const scrollDot = (dot: number) => navigate(dot);

	const buttonA11y = (type: 'prev' | 'next') => ({
		'aria-controls': `${id}-slides`,
		'aria-label': type === 'prev' ? 'Previous slide' : 'Next slide'
	});
</script>

{#if slides.length > 0}
	<div aria-roledescription="carousel" {id} class={containerClass} data-carousel-container>
		<div
			class={$$props.class}
			data-carousel-slider
			data-carousel-with-grab-cursor={withGrabCursor}
			data-dragging="false"
			data-drag-free={dragFree}
			use:dragScroll={{
				layout,
				id,
				autoHeight,
				pauseOnHover,
				partialDelta,
				onInit,
				onChange,
				dragFree,
				oneAtTime,
				autoPlay,
				axis
			}}
			style:--padding-xs={`${(axis.xs || axis.default) === 'x' ? '0 ' : ''}${
				gap.xs ?? gap.default ?? 20
			}px ${(axis.xs || axis.default) === 'x' ? '' : '0'}`}
			style:--padding-sm={`${(axis.sm || axis.default) === 'x' ? '0 ' : ''}${
				gap.sm ?? gap.default ?? 20
			}px ${(axis.sm || axis.default) === 'x' ? '' : '0'}`}
			style:--padding-md={`${(axis.md || axis.default) === 'x' ? '0 ' : ''}${
				gap.md ?? gap.default ?? 20
			}px ${(axis.md || axis.default) === 'x' ? '' : '0'}`}
			style:--padding-lg={`${(axis.lg || axis.default) === 'x' ? '0 ' : ''}${
				gap.lg ?? gap.default ?? 20
			}px ${(axis.lg || axis.default) === 'x' ? '' : '0'}`}
			style:--padding-xl={`${(axis.xl || axis.default) === 'x' ? '0 ' : ''}${
				gap.xl ?? gap.default ?? 20
			}px ${(axis.xl || axis.default) === 'x' ? '' : '0'}`}
			style:--overflow-xs={axis.xs === 'x'
				? `${disableNativeScroll.xs ?? disableNativeScroll.default ? 'hidden' : 'auto'} visible`
				: `visible ${disableNativeScroll.xs ?? disableNativeScroll.default ? 'hidden' : 'auto'}`}
			style:--overflow-sm={axis.sm === 'x'
				? `${disableNativeScroll.sm ?? disableNativeScroll.default ? 'hidden' : 'auto'} visible`
				: `visible ${disableNativeScroll.sm ?? disableNativeScroll.default ? 'hidden' : 'auto'}`}
			style:--overflow-md={axis.md === 'x'
				? `${disableNativeScroll.md ?? disableNativeScroll.default ? 'hidden' : 'auto'} visible`
				: `visible ${disableNativeScroll.md ?? disableNativeScroll.default ? 'hidden' : 'auto'}`}
			style:--overflow-lg={axis.lg === 'x'
				? `${disableNativeScroll.lg ?? disableNativeScroll.default ? 'hidden' : 'auto'} visible`
				: `visible ${disableNativeScroll.lg ?? disableNativeScroll.default ? 'hidden' : 'auto'}`}
			style:--overflow-xl={axis.xl === 'x'
				? `${disableNativeScroll.xl ?? disableNativeScroll.default ? 'hidden' : 'auto'} visible`
				: `visible ${disableNativeScroll.xl ?? disableNativeScroll.default ? 'hidden' : 'auto'}`}
			style:--layout-xs={`${100 / (layout.xs ?? layout.default ?? 1)}%`}
			style:--layout-sm={`${100 / (layout.sm ?? layout.default ?? 2)}%`}
			style:--layout-md={`${100 / (layout.md ?? layout.default ?? 2)}%`}
			style:--layout-lg={`${100 / (layout.lg ?? layout.default ?? 3)}%`}
			style:--layout-xl={`${100 / (layout.xl ?? layout.default ?? 4)}%`}
			style:--partial-delta-xs={`${partialDelta.xs ?? partialDelta.default ?? 0}px`}
			style:--partial-delta-sm={`${partialDelta.sm ?? partialDelta.default ?? 0}px`}
			style:--partial-delta-md={`${partialDelta.md ?? partialDelta.default ?? 0}px`}
			style:--partial-delta-lg={`${partialDelta.lg ?? partialDelta.default ?? 0}px`}
			style:--partial-delta-xl={`${partialDelta.xl ?? partialDelta.default ?? 0}px`}
			data-axis-xs={axis.xs || axis.default || 'x'}
			data-axis-sm={axis.sm || axis.default || 'x'}
			data-axis-md={axis.md || axis.default || 'x'}
			data-axis-lg={axis.lg || axis.default || 'x'}
			data-axis-xl={axis.xl || axis.default || 'x'}
			style:transform={autoHeight ? 'scaleY(0%)' : ''}
			id={`${id}-slides`}
		>
			<!-- style:--flex-direction={axis === 'x' ? 'row' : 'column'}
			style:--display={axis === 'x' ? 'flex' : 'grid'}
			style:--snap-type={axis === 'x' ? 'x mandatory' : 'y mandatory'} -->
			{#each slides as slide, index (key ? slide[key] : index)}
				<div
					id={`${id}-slide-${index + 1}`}
					aria-label={`Slide ${index + 1} of ${slides.length} `}
					aria-roledescription="slide"
					role="tabpanel"
					class={slideClass}
					data-carousel-slide={index}
				>
					<slot name="slide" inView={slidesInView.includes(index)} {index} {slide} />
				</div>
			{/each}
		</div>

		<slot name="progress" scrollTo={scrollProgress} {progress} />
		<slot
			name="dots"
			a11y={{
				'aria-label': 'Slides',
				role: 'tablist'
			}}
			scrollTo={scrollDot}
			{dots}
		/>
		<slot
			name="pagination"
			{next}
			{canScrollNext}
			{prev}
			{canScrollPrev}
			nextA11y={buttonA11y('next')}
			prevA11y={buttonA11y('prev')}
		/>
		<slot name="next" {next} {canScrollNext} a11y={buttonA11y('next')} />
		<slot name="prev" {prev} {canScrollPrev} a11y={buttonA11y('prev')} />
	</div>
{/if}

<style>
	[data-carousel-container] {
		position: relative;
		overflow: visible;
		min-height: 100%;
		display: flex;
		flex-direction: column;
		min-width: 100%;
	}

	[data-carousel-slider] {
		display: flex;
		flex-direction: row;
		user-select: none;
		position: relative;
		flex-wrap: nowrap;
		max-height: 100%;
		max-width: 100%;
	}
	:global([data-carousel-slider][data-dragging='false'][data-drag-free='false']) {
		scroll-snap-type: x mandatory;
	}
	[data-carousel-with-grab-cursor='true'] {
		cursor: grab;
	}
	[data-carousel-with-grab-cursor='true']:active {
		cursor: grabbing;
	}
	[data-carousel-slide] {
		height: auto;
	}

	@media (max-width: 640px) {
		[data-carousel-slider] {
			overflow: var(--overflow-xs);
		}
		[data-carousel-slider] > [data-carousel-slide] {
			flex: 0 0 calc(var(--layout-xs) - var(--partial-delta-xs));
			padding: var(--padding-xs);
		}
		:global([data-carousel-slider][data-axis-xs='y']) {
			flex-direction: column !important;
		}
		:global(
				[data-carousel-slider][data-axis-xs='y'][data-dragging='false'][data-drag-free='false']
			) {
			scroll-snap-type: y mandatory;
		}
	}
	@media (min-width: 640px) {
		[data-carousel-slider] {
			overflow: var(--overflow-sm);
		}
		[data-carousel-slider] > [data-carousel-slide] {
			flex: 0 0 calc(var(--layout-sm) - var(--partial-delta-sm));
			padding: var(--padding-sm);
		}
		:global([data-carousel-slider][data-axis-sm='y']) {
			flex-direction: column !important;
		}
		:global(
				[data-carousel-slider][data-axis-sm='y'][data-dragging='false'][data-drag-free='false']
			) {
			scroll-snap-type: y mandatory;
		}
	}
	@media (min-width: 768px) {
		[data-carousel-slider] {
			overflow: var(--overflow-md);
		}
		[data-carousel-slider] > [data-carousel-slide] {
			flex: 0 0 calc(var(--layout-md) - var(--partial-delta-md));
			padding: var(--padding-md);
		}
		:global([data-carousel-slider][data-axis-md='y']) {
			flex-direction: column !important;
		}
		:global(
				[data-carousel-slider][data-axis-md='y'][data-dragging='false'][data-drag-free='false']
			) {
			scroll-snap-type: y mandatory;
		}
	}

	@media (min-width: 1024px) {
		[data-carousel-slider] {
			overflow: var(--overflow-lg);
		}
		[data-carousel-slider] > [data-carousel-slide] {
			flex: 0 0 calc(var(--layout-lg) - var(--partial-delta-lg));
			padding: var(--padding-lg);
		}
		:global([data-carousel-slider][data-axis-lg='y']) {
			flex-direction: column !important;
		}
		:global(
				[data-carousel-slider][data-axis-lg='y'][data-dragging='false'][data-drag-free='false']
			) {
			scroll-snap-type: y mandatory;
		}
	}
	@media (min-width: 1280px) {
		[data-carousel-slider] {
			overflow: var(--overflow-xl);
		}
		[data-carousel-slider] > [data-carousel-slide] {
			flex: 0 0 calc(var(--layout-xl) - var(--partial-delta-xl));
			padding: var(--padding-xl);
		}
		:global([data-carousel-slider][data-axis-xl='y']) {
			flex-direction: column !important;
		}
		:global(
				[data-carousel-slider][data-axis-xl='y'][data-dragging='false'][data-drag-free='false']
			) {
			scroll-snap-type: y mandatory;
		}
	}

	:global([data-carousel-slider] img) {
		user-select: none;
	}

	[data-carousel-slider]::-webkit-scrollbar {
		display: none;
	}
	[data-carousel-slider] {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	:global([data-carousel-slider][data-dragging='false'][data-drag-free='false']) {
		scroll-snap-type: mandatory;
		scroll-behavior: smooth;
	}
	:global(
			[data-carousel-slider][data-dragging='false'][data-drag-free='false'] > [data-carousel-slide]
		) {
		scroll-snap-align: start;
	}
</style>