import type { PageLoad } from './$types'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { braintreeCheckoutReq } from '$lib/validators'
import { GenerateBraintreeClientToken } from '$lib/vendure'

export const prerender = false

export const load = (async function ({ parent }) {
	const { client } = await parent()
	const authorization = await client.query(GenerateBraintreeClientToken, { includeCustomerId: false }).toPromise().then((result: any) => result?.data?.generateBraintreeClientToken)
	const form = await superValidate(zod(braintreeCheckoutReq))
	return {
		authorization,
		form
	}
}) satisfies PageLoad