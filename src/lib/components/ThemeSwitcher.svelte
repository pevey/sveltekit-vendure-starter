<script lang="ts">
	import { themeStore, setTheme } from '$lib/stores'
	$: theme = $themeStore.theme
	$: resolvedTheme = $themeStore.resolvedTheme
</script>
{#if (theme === 'dark') || (theme === 'system' && resolvedTheme === 'dark')}
	<button on:click={() => setTheme('light')} class="flex relative ml-2 p-2 items-center justify-center hover:bg-stone-200 rounded-md">
		<!-- sun icon -->
		<svg class="fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
	</button>
{:else}
	<button on:click={() => setTheme('dark')} class="flex relative ml-2 p-2 items-center justify-center hover:bg-stone-200 rounded-md">
		<!-- moon icon -->
		<svg class="fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
	</button>
{/if}