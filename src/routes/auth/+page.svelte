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
		GetActiveOrder, 
		GetCustomer, 
		SignIn, 
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
	let token: string = '' // turnstile token
	if (!PUBLIC_TURNSTILE_SITE_KEY) token = Math.floor(Math.random() * 1000000).toString()
	let reveal: boolean = false
	let success: boolean = false

	const updateStores = async () => {
		const promises = Promise.all([
			client.query(GetActiveOrder, {}, { requestPolicy: 'network-only' }).toPromise(),
			client.query(GetCustomer, {}, { requestPolicy: 'network-only'} ).toPromise(),
		])
		const [orderResult, customerResult] = await promises
		if (orderResult?.data?.activeOrder) cartStore.set(orderResult.data.activeOrder)
		if (customerResult?.data?.activeCustomer) userStore.set(customerResult.data.activeCustomer)
	}

	const handleSignIn = async () => {
		updateStores()
		await goto('/')
	}

	const client = getContextClient()

	const signInForm = superForm(data.signInForm, { 
			SPA: true,
			validators: zod(signInReq),
			onUpdate: async ({ form }) => {
				if (form.valid) {
					const loginResult = await client.mutation(SignIn, { username: form.data.email.toLowerCase(), password: form.data.password, rememberMe: false }).toPromise()
					if (loginResult?.data?.login?.__typename === 'CurrentUser') {
						handleSignIn()
					} else {
						if (loginResult?.data?.login?.__typename === 'InvalidCredentialsError') {
							setMessage(form, 'The email or password you entered is incorrect.')
						} else if (loginResult?.data?.login?.__typename === 'NotVerifiedError') {
							setMessage(form, 'Your account has not been verified. Please check your email for a verification link.')
					// } else if (loginResult?.data?.login?.__typename === 'TooManyFailedAttemptsError') {
					// 	setMessage(form, 'Too many failed attempts. Please try again later.')
						} else {
							setMessage(form, 'An unknown error occurred. Please try again.')
						}
					}
				} else {
					setMessage(form, 'Please correct the errors below.')
				}
				if (PUBLIC_TURNSTILE_SITE_KEY) token = ''
			}
		})
	const { form: signInFormData, enhance: signInEnhance, message: signInMessage } = signInForm
	$: $signInFormData.token = token

	const signUpForm = superForm(data.signUpForm, { 
			SPA: true,
			validators: zod(signUpReq),
			onUpdate: async ({ form }) => {
				success = false
				if (form.valid) {
					const registerResult = await client.mutation(SignUp, { input: { 
						emailAddress: form.data.email.toLowerCase(), 
						password: form.data.password, 
						firstName: form.data.fname, 
						lastName: form.data.lname } }).toPromise()
					if (registerResult?.data?.registerCustomerAccount?.__typename === 'Success') {
						setMessage(form, 'Your account has been created. Please check your email for a verification link.')
						success = true
					} else {
						if (registerResult?.data?.registerCustomerAccount?.__typename === 'PasswordValidationError') {
							setMessage(form, 'The password entered is not a strong password.  Please try again.')
						} else {
							setMessage(form, 'An unknown error occurred. Please try again.')
						}
					}
				} else {
					setMessage(form, 'Please correct the errors below.')
				}
				if (PUBLIC_TURNSTILE_SITE_KEY) token = ''
			}
		})
	const { form: signUpFormData, enhance: signUpEnhance, message: signUpMessage } = signUpForm
	$: $signUpFormData.token = token

	const forgotForm = superForm(data.forgotForm, { 
			SPA: true,
			validators: zod(forgotReq),
			onUpdate: async ({ form }) => {
				success = false
				if (form.valid) {
					const resetResult = await client.mutation(RequestPasswordReset, { emailAddress: form.data.email.toLowerCase() }).toPromise()
					if (resetResult?.data?.requestPasswordReset?.__typename === 'Success') {
						setMessage(form, 'An email has been sent with a link to reset your password.')
						success = true
					} else {
						setMessage(form, 'An unknown error occurred. Please try again.')
					}
				} else {
					setMessage(form, 'Please correct the errors below.')
				}
				if (PUBLIC_TURNSTILE_SITE_KEY) token = ''
			}
		})
	const { form: forgotFormData, enhance: forgotEnhance, message: forgotMessage } = forgotForm
	$: $forgotFormData.token = token

	const resetForm = superForm(data.resetForm, { 
			SPA: true,
			validators: zod(resetReq),
			onUpdate: async ({ form }) => {
				success = false
				if (form.valid) {
					const resetResult = await client.mutation(ResetPassword, { token: form.data.token, password: form.data.password }).toPromise()
					if (resetResult?.data?.resetPassword?.__typename === 'CurrentUser') {
						setMessage(form, 'Your password has been reset.')
						success = true
					} else {
						if (resetResult?.data?.resetPassword?.__typename === 'PasswordResetTokenInvalidError') {
							setMessage(form, 'The reset code entered is incorrect.')
						} else if (resetResult?.data?.resetPassword?.__typename === 'PasswordResetTokenExpiredError') {
							setMessage(form, 'The reset code entered has expired.')
						} else if (resetResult?.data?.resetPassword?.__typename === 'PasswordValidationError') {
							setMessage(form, 'The password entered is not a strong password.  Please try again.')
						} else {
							setMessage(form, 'An unknown error occurred. Please try again.')
						}
					}
				} else {
					setMessage(form, 'Please correct the errors below.')
				}
				if (PUBLIC_TURNSTILE_SITE_KEY) token = ''
			}
		})
	const { form: resetFormData, enhance: resetEnhance, message: resetMessage } = resetForm
	$: $resetFormData.token = token
	$: $resetFormData.code = $code || ''

</script>
<AuthContainer>
	{#if !token && PUBLIC_TURNSTILE_SITE_KEY}
		<Turnstile 
			theme={$themeStore?.theme || 'light'} 
			siteKey={PUBLIC_TURNSTILE_SITE_KEY} 
			on:turnstile-callback={(e) => { token = e.detail.token }}
		/>

	{:else if state === 'signIn'}
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

	{:else if state === 'signUp'}
		{#if success}
			<div class="message">{$signUpMessage}</div>
		{:else}
			<form method="POST" use:signUpEnhance>
				<h3 class="font-heading text-3xl text-gray-900 font-semibold text-center mb-4">Create an Account</h3>
				{#if $signUpMessage}
					<div class="message" class:text-red-600={$page.status > 200}>{$signUpMessage}</div>
				{:else}
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
				{/if}
			</form>
		{/if}

	{:else if state === 'forgot'}
		{#if success}
			<div class="message">{$forgotMessage}</div>
		{:else}
			<form method="POST" use:forgotEnhance>
				<h3 class="font-heading text-3xl text-gray-900 font-semibold text-center mb-4">Reset Your Password</h3>
				{#if $forgotMessage}
					<div class="message" class:text-red-600={$page.status > 200}>{$forgotMessage}</div>
				{:else}
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
				{/if}
			</form>
		{/if}

	{:else if state === 'reset'}
		{#if success}
			<div class="message">{$resetMessage}</div>
		{:else}
			<form method="POST" use:resetEnhance>
				<h3 class="font-heading text-3xl text-gray-900 font-semibold text-center mb-4">Choose a New Password</h3>
				{#if $resetMessage}
					<div class="message" class:text-red-600={$page.status > 200}>{$resetMessage}</div>
				{:else}
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
					<button type="submit" class="button">Save New Password</button>
				{/if}
			</form>
		{/if}	
	{/if}
</AuthContainer>