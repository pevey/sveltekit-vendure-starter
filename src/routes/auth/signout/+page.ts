import type { PageLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { browser } from '$app/environment'
import { SignOut } from '$lib/vendure'

export const load = (async ({ parent }) => {
	const { client } = await parent()
	if (browser) {
		const result = await client.mutation(SignOut, {}).toPromise()
		// TODO: handle error
		console.log(result)
		// redirect(302, '/')
	}
	return {}
}) satisfies PageLoad