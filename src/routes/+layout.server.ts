import type { LayoutServerLoad } from './$types'
// import { getTopLevelCollections } from '$lib/server/vendure'

export const load: LayoutServerLoad = async function ({ locals }) {
	return {
		// collections: await getTopLevelCollections(),
		collections: [],
		// locals.user and locals.cart are set in hooks.server.js
		user: locals.user, 
		cart: locals.cart
	}
}