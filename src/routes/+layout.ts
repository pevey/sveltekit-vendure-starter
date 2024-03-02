import type { LayoutLoad } from './$types'
import { Client, cacheExchange, fetchExchange, ssrExchange, setContextClient } from '@urql/svelte'
import { browser, dev } from '$app/environment'
import { PUBLIC_SHOPAPI_DEV_URL, PUBLIC_SHOPAPI_PROD_URL } from '$env/static/public'



export const load = (async function ({ params }) {
	return {
		// collection: await getCollection(params.slug),
		// products: await getCollectionProducts(params.slug)
	}
}) satisfies LayoutLoad