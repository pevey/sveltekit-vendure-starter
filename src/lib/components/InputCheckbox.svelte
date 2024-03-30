<script lang="ts" context="module">
	type T = Record<string, unknown>
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { type SuperForm, type FormPathLeaves, formFieldProxy } from 'sveltekit-superforms'

	export let form: SuperForm<T>
	export let field: FormPathLeaves<T>
	export let label: string = ''
	export let dataAttribute: string = 'true' // pass a specific string for more granular styling

	const { value, errors, constraints } = formFieldProxy(form, field)
</script>

<input 
	type="checkbox" 
	name={field} 
	id={field} 
	bind:checked={field} 
	{...$constraints}
	{...$$restProps} 
	data-checkbox-input={dataAttribute}
	aria-describedby={$errors ? `${field}-error` : undefined}
	aria-invalid={$errors ? 'true' : undefined}
	aria-required={$constraints?.required ? "true" : undefined}
/> 
{#if label}
	<label for={field} data-label={dataAttribute}> {label}</label>
{/if}
<span id={`${field}-error`} aria-live="assertive">
	{#if $errors?.length}
		{#each $errors as err}
			<span class="invalid">{err} </span>
		{/each}
	{/if}
</span>