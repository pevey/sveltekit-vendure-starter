<script lang="ts">
	import type { PageData } from './$types'
	import { Turnstile } from 'sveltekit-turnstile'
	import { setMessage, superForm } from 'sveltekit-superforms'
	import { zod } from 'sveltekit-superforms/adapters'
	import { Field, Control, Label, FieldErrors } from 'formsnap'
	import { queryParam } from 'sveltekit-search-params'
	import { getContextClient } from '@urql/svelte'
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import { 
		createClient,
		GetActiveOrder, 
		GetCustomer, 
		SignIn, 
		SignOut, 
		SignUp, 
		ResetPassword, 
		RequestPasswordReset 
	} from '$lib/vendure'
	import { signInReq, signUpReq, forgotReq, resetReq } from '$lib/validators'
	import { cartStore, userStore, themeStore } from '$lib/stores'
	import AuthContainer from '$lib/components/AuthContainer.svelte'
	import ShowHideIcon from '$lib/components/ShowHideIcon.svelte'
	import AppleButton from '$lib/components/AppleButton.svelte'
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public'

	export let data: PageData

	if ($userStore) goto('/')

	type state = 'signIn' | 'signUp' | 'forgot' | 'reset'
	const code = queryParam('token') // reset code
	let state = $code? 'reset' : 'signIn'
	// let token: string = '' // turnstile token
	let token: string = 'abc'
	let reveal: boolean = false
	let processing: boolean = false
	
	const redirect = async function(rurl: string = '') {
		// await goto(data.rurl? data.rurl : '/')
		window.location.href = `/${rurl}`
	}

	const client = getContextClient()

	const signInForm = superForm(data.signInForm, { 
			SPA: true,
			validators: zod(signInReq),
			onUpdate: async ({ form }) => {
				processing = true
				if (form.valid) {
					const loginResult = await client.mutation(SignIn, { username: form.data.email.toLowerCase(), password: form.data.password, rememberMe: false }).toPromise()
					if (loginResult?.data?.login?.__typename === 'InvalidCredentialsError') {
						setMessage(form, 'The email or password you entered is incorrect.')
						token = ''
						processing = false
					} else if (loginResult?.data?.login?.__typename === 'NotVerifiedError') {
						setMessage(form, 'Your account has not been verified. Please check your email for a verification link.')
						token = ''
						processing = false
					// } else if (loginResult?.data?.login?.__typename === 'TooManyFailedAttemptsError') {
					// 	setMessage(form, 'Too many failed attempts. Please try again later.')
					// 	token = ''
					// 	processing = false
					} else if (loginResult?.data?.login?.__typename === 'CurrentUser') {
						const orderResult = await client.query(GetActiveOrder, {}, { requestPolicy: 'network-only' }).toPromise()
						if (orderResult?.data?.activeOrder) cartStore.set(orderResult.data.activeOrder)
						const customerResult = await client.query(GetCustomer, {}, { requestPolicy: 'network-only'} ).toPromise()
						if (customerResult?.data?.activeCustomer) userStore.set(customerResult.data.activeCustomer)
						redirect()
					} else {
						setMessage(form, 'An unknown error occurred. Please try again.')
						token = ''
						processing = false
					}
				} else {
					setMessage(form, 'Please correct the errors below.')
					processing = false
				}
			},
		})
	const { form: signInFormData, enhance: signInEnhance, message: signInMessage } = signInForm
	$: $signInFormData.token = token

	const signUpForm = superForm(data.signUpForm, { 
			SPA: true,
			validators: zod(signUpReq),
			onSubmit: () => {
				processing = true
			},
			onResult: ({ result }) => {
				if (result.type === 'success') {
					// handleSignIn()
					// verify email
				} else {
					token = ''
					processing = false
				}
			}
		})
	const { form: signUpFormData, enhance: signUpEnhance, message: signUpMessage } = signUpForm
	$: $signUpFormData.token = token

	const forgotForm = superForm(data.forgotForm, { 
			SPA: true,
			validators: zod(forgotReq),
			onSubmit: () => {
				processing = true
			},
			onResult: () => {
				token = ''
				processing = false
			}
		})
	const { form: forgotFormData, enhance: forgotEnhance, message: forgotMessage } = forgotForm
	$: $forgotFormData.token = token

	const resetForm = superForm(data.resetForm, { 
			SPA: true,
			validators: zod(resetReq),
			onSubmit: () => {
				processing = true
			},
			onResult: () => {
				token = ''
				processing = false
			}
		})
	const { form: resetFormData, enhance: resetEnhance, message: resetMessage } = resetForm
	$: $resetFormData.token = token
	$: $resetFormData.code = $code || ''

</script>
<AuthContainer>
	<!-- {#if !token}
		<Turnstile 
			theme={$themeStore?.theme || 'light'} 
			siteKey={PUBLIC_TURNSTILE_SITE_KEY} 
			on:turnstile-callback={(e) => { token = e.detail.token }}
		/>

	{:else if state === 'signIn'} -->
	{#if state === 'signIn'}
		{#if processing}
			<div class="message">Processing...</div>
		{:else}
			<form method="POST" use:signInEnhance>
				<h3 class="font-heading text-3xl text-gray-900 font-semibold text-center mb-4">Sign In to Your Account</h3>
				{#if $signInMessage}
					<div class="message" class:text-red-600={$page.status > 200}>{$signInMessage}</div>
				{:else}
					<p class="text-lg text-gray-500 mb-6">If you have an existing account, enter your email and password below.</p>
				{/if}
				<Field form={signInForm} name="token">
					<Control let:attrs>
						<input {...attrs} type="hidden" bind:value={$signInFormData.token} />
					</Control>
				</Field>
				<Field form={signInForm} name="email">
					<Control let:attrs>
						<Label>Email</Label>
						<input {...attrs} bind:value={$signInFormData.email} />
					</Control>
					<FieldErrors />
				</Field>
				<Field form={signInForm} name="password">
					<Control let:attrs>
						<Label>Password</Label>
						<ShowHideIcon bind:reveal={reveal}>
							{#if reveal}
								<input {...attrs} type="text" bind:value={$signInFormData.password} />
							{:else}
								<input {...attrs} type="password" bind:value={$signInFormData.password} />
							{/if}
						</ShowHideIcon>
					</Control>
					<FieldErrors />
				</Field>
				<button type="submit" class="button">Sign In</button>
				<AppleButton />
				<div class="text-gray-900 text-sm text-center font-medium">
					<span>Don't have an account?&nbsp;&nbsp;</span>
					<button type="button" on:click="{() => { state = 'signUp' }}" class="text-orange-900 hover:text-orange-700">
						Sign Up
					</button>
				</div>
				<div class="text-sm text-gray-900 text-center font-medium">
					<button type="button" on:click="{() => { state = 'forgot' }}" class="mt-4 hover:text-gray-700">
						Forgot your password?
					</button>
				</div>
			</form>
		{/if}

	{:else if state === 'signUp'}
		<form method="POST" use:signUpEnhance>
			<h3 class="font-heading text-3xl text-gray-900 font-semibold text-center mb-4">Create an Account</h3>
			<p class="text-lg text-gray-500 mb-6">Welcome! To create an account, please enter your email and choose a password below.</p>
			<Field form={signUpForm} name="token">
				<Control let:attrs>
					<input {...attrs} type="hidden" bind:value={$signUpFormData.token} />
				</Control>
			</Field>
			<Field form={signUpForm} name="fname">
				<Control let:attrs>
					<Label>First Name</Label>
					<input {...attrs} bind:value={$signUpFormData.fname} />
				</Control>
				<FieldErrors />
			</Field>
			<Field form={signUpForm} name="lname">
				<Control let:attrs>
					<Label>Last Name</Label>
					<input {...attrs} bind:value={$signUpFormData.lname} />
				</Control>
				<FieldErrors />
			</Field>
			<Field form={signUpForm} name="email">
				<Control let:attrs>
					<Label>Email</Label>
					<input {...attrs} bind:value={$signUpFormData.email} />
				</Control>
				<FieldErrors />
			</Field>
			<Field form={signUpForm} name="password">
				<Control let:attrs>
					<Label>Password</Label>
					<ShowHideIcon bind:reveal={reveal}>
						{#if reveal}
							<input {...attrs} type="text" bind:value={$signUpFormData.password} />
						{:else}
							<input {...attrs} type="password" bind:value={$signUpFormData.password} />
						{/if}
					</ShowHideIcon>
				</Control>
				<FieldErrors />
			</Field>
			<button type="submit" class="button">Create Account</button>
			<AppleButton />
			<div class="text-sm text-gray-900 text-center font-medium">
				<span>Already have an account?&nbsp;&nbsp;</span>
				<button type="button" on:click="{() => { state = 'signIn' }}" class="text-orange-900 hover:text-orange-700">
					Sign In
				</button>
			</div>
		</form>

	{:else if state === 'forgot'}
		<form method="POST" use:forgotEnhance>
			<h3 class="font-heading text-3xl text-gray-900 font-semibold text-center mb-4">Reset Your Password</h3>
			<p class="text-lg text-gray-500 mb-6">Enter your email address to receive an email with a link to change your password.</p>
			<Field form={forgotForm} name="token">
				<Control let:attrs>
					<input {...attrs} type="hidden" bind:value={$forgotFormData.token} />
				</Control>
			</Field>
			<Field form={forgotForm} name="email">
				<Control let:attrs>
					<Label>Email</Label>
					<input {...attrs} bind:value={$forgotFormData.email} />
				</Control>
				<FieldErrors />
			</Field>
			<button type="submit" class="button">Request Reset Code</button>
			<div class="pt-6 text-sm text-gray-900 text-center font-medium">
				<button type="button" on:click="{() => { state = 'signIn' }}" class="text-gray-900 hover:text-orange-700">
					&larr;&nbsp; Sign In Instead
				</button>
			</div>
		</form>

	{:else if state === 'reset'}
		<form method="POST" use:resetEnhance>
			<h3 class="font-heading text-3xl text-gray-900 font-semibold text-center mb-4">Choose a New Password</h3>
			<Field form={resetForm} name="token">
				<Control let:attrs>
					<input {...attrs} type="hidden" bind:value={$resetFormData.token} />
				</Control>
			</Field>
			<Field form={resetForm} name="code">
				<Control let:attrs>
					<input {...attrs} type="hidden" bind:value={$resetFormData.code} />
				</Control>
			</Field>
			<Field form={resetForm} name="password">
				<Control let:attrs>
					<Label>Password</Label>
					<ShowHideIcon bind:reveal={reveal}>
						{#if reveal}
							<input {...attrs} type="text" bind:value={$resetFormData.password} />
						{:else}
							<input {...attrs} type="password" bind:value={$resetFormData.password} />
						{/if}
					</ShowHideIcon>
				</Control>
				<FieldErrors />
			</Field>
			<button type="submit" class="button">Request Reset Code</button>
			<slot name="footer" />
		</form>   
	{/if}
</AuthContainer>