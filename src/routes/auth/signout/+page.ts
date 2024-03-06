import type { PageLoad } from './$types'
import { browser } from '$app/environment'
import { SignOut } from '$lib/vendure'

export const load = (async ({ parent }) => {
	let result: any
	if (browser) {
		const { client } = await parent()
		result = await client.mutation(SignOut, {}).toPromise()
	}
	return {
		result: result?.data?.logout?.success
	}
}) satisfies PageLoad