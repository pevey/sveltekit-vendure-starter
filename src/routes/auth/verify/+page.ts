import type { PageLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { browser } from '$app/environment'
import { VerifyCustomerAccount } from '$lib/vendure'

export const load = (async ({ url, parent }) => {
	// vendure token renamed to code so as to not conflict with cf token if used
	const code = url.searchParams.get('token') || '' 
	let result: any
	if (browser) {
		const { client } = await parent()
		result = await client.mutation(VerifyCustomerAccount, { token: code }).toPromise()
	}
	return {
		result: result?.data?.verifyCustomerAccount?.__typename,
		code
	}
}) satisfies PageLoad