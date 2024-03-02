import type { PageLoad } from './$types'

export const load = (async function ({ params }) {
	return {
		// slug: params.slug,
	}
}) satisfies PageLoad