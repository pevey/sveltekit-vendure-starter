import type { PageLoad } from './$types'
import { GetCollection } from '$lib/vendure'

export const load = (async function ({ parent, params }) {
	const { client } = await parent()
	return {
		result: await client.query(GetCollection, { slug: params.slug }).toPromise().then((result: any) => result?.data)
	}
}) satisfies PageLoad