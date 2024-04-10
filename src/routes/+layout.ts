import { createClient, GetTopLevelCollections } from '$lib/vendure'

const client = createClient()

export const prerender = true

export async function load() {
	return {
		client,
		collections: await client.query(GetTopLevelCollections, {}).toPromise().then((result) => result?.data?.collections?.items)
	}
}