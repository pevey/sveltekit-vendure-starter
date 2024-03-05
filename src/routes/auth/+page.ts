import type { PageLoad } from './$types'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { signInReq, signUpReq, forgotReq, resetReq } from '$lib/validators'

export const load = (async () => {
	const signInForm = await superValidate(zod(signInReq), { id: 'signIn' })
	const signUpForm = await superValidate(zod(signUpReq), { id: 'signUp' })
	const forgotForm = await superValidate(zod(forgotReq), { id: 'forgot' })
	const resetForm = await superValidate(zod(resetReq), { id: 'reset' })
	return {
		signUpForm,
		signInForm,
		forgotForm,
		resetForm
	}
}) satisfies PageLoad