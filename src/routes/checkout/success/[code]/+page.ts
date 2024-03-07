import type { PageLoad } from './$types'

export const load = (async function ({ params, url }) {
	const code = params.code
	const status = url.searchParams.get('redirect_status')
	return {
		code,
		delay: await new Promise(resolve => setTimeout(resolve, 500)) // allow the order to be processed via the webhook before the page is rendered
	}
}) satisfies PageLoad