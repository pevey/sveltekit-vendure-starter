import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async function ({ locals }) {
	return {
		sid: locals.sid,
		ssig: locals.ssig,
	}
}