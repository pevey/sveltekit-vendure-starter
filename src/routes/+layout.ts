import type { LayoutLoad } from './$types'
import { browser, dev } from '$app/environment'
import { Client, cacheExchange, fetchExchange, ssrExchange, queryStore, setContextClient, type ExchangeInput } from '@urql/svelte'
import { PUBLIC_SHOPAPI_DEV_URL, PUBLIC_SHOPAPI_PROD_URL } from '$env/static/public'

const ssr = ssrExchange({ 
	isClient: browser,
	initialState: browser? window.__URQL_DATA__ : undefined
})

const client = new Client({
	url: dev? PUBLIC_SHOPAPI_DEV_URL : PUBLIC_SHOPAPI_PROD_URL,
	exchanges: [cacheExchange, ssr, fetchExchange],
	fetchOptions: {
		credentials: 'include'
	}
	// fetchOptions: () => {
	// 	const token = getToken()
	// 	return {
	// 		headers: { authorization: token ? `Bearer ${token}` : '' },
	// 	}
	// },
})

export const load = (async function ({ params }) {
	return {
		client
	}
}) satisfies LayoutLoad