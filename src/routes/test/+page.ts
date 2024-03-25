import type { PageLoad } from './$types'
import { GenerateBraintreeClientToken } from '$lib/vendure'

export const prerender = false

export const load = (async function ({ parent }) {
	const { client } = await parent()
	const authorization = await client.query(GenerateBraintreeClientToken, {}).toPromise().then((result: any) => result?.data?.generateBraintreeClientToken)
	return {
		authorization
	}
}) satisfies PageLoad