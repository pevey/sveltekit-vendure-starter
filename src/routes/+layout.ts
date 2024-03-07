import type { LayoutLoad } from './$types'
import { createClient, GetTopLevelCollections } from '$lib/vendure'

const client = createClient()

export const prerender = true

export const load = (async function () {
	return {
		client,
		collections: await client.query(GetTopLevelCollections, {}).toPromise().then((result) => result?.data?.collections?.items)
	}
}) satisfies LayoutLoad