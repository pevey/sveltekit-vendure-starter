<script lang="ts" context="module">
	type T = Record<string, unknown>
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { type SuperForm, type FormPathLeaves, formFieldProxy } from 'sveltekit-superforms'
	import ShowHideIcon from '$lib/components/ShowHideIcon.svelte'

	export let form: SuperForm<T>
	export let field: FormPathLeaves<T>
	export let label: string = ''
	export let dataAttribute: string = 'true' // pass a specific string for more granular styling
	export let type: string = 'text'
	export let reveal: boolean = false

	const { value, errors, constraints } = formFieldProxy(form, field)
</script>

{#if label}
	<label for={field} data-label={dataAttribute}>{label}</label>
{/if}
{#if type === 'password'}
	<ShowHideIcon bind:reveal={reveal}>
		{#if reveal}
			<input
				type="text"
				name={field}
				id={field}
				bind:value={$value}
				{...$constraints}
				{...$$restProps} 
				data-text-input={dataAttribute}
				aria-describedby={$errors ? `${field}-error` : undefined}
				aria-invalid={$errors ? 'true' : undefined}
				aria-required={$constraints?.required ? "true" : undefined}
			/>
		{:else}
			<input
				type="password"
				name={field}
				id={field}
				bind:value={$value}
				{...$constraints}
				{...$$restProps} 
				data-text-input={dataAttribute}
				aria-describedby={$errors ? `${field}-error` : undefined}
				aria-invalid={$errors ? 'true' : undefined}
				aria-required={$constraints?.required ? "true" : undefined}
			/>
		{/if}
	</ShowHideIcon>
{:else}
	<input
		type="text"
		name={field}
		id={field}
		bind:value={$value}
		{...$constraints}
		{...$$restProps} 
		data-text-input={dataAttribute}
		aria-describedby={$errors ? `${field}-error` : undefined}
		aria-invalid={$errors ? 'true' : undefined}
		aria-required={$constraints?.required ? "true" : undefined}
	/>
{/if}
<span id={`${field}-error`} aria-live="assertive">
	{#if $errors?.length}
		{#each $errors as err}
			<span class="invalid">{err} </span>
		{/each}
	{/if}
</span>