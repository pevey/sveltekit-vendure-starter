import type { PageLoad } from './$types'
import { GetProduct } from '$lib/vendure'

export const load = (async function ({ parent, params }) {
	const { client } = await parent()
	return {
		client,
		product: await client.query(GetProduct, { slug: params.slug }).toPromise().then((result: any) => result?.data?.product)
	}
}) satisfies PageLoad