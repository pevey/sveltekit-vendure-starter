import { Client, cacheExchange, fetchExchange, ssrExchange, queryStore, setContextClient } from '@urql/svelte'
import { dev } from '$app/environment'
import { PUBLIC_SHOPAPI_DEV_URL, PUBLIC_SHOPAPI_PROD_URL } from '$env/static/public'

export * from './collection.graphql'
export * from './customer.graphql'
export * from './order.graphql'
export * from './product.graphql'

export const createClient = () => {
	return new Client({
		url: dev ? PUBLIC_SHOPAPI_DEV_URL : PUBLIC_SHOPAPI_PROD_URL,
		exchanges: [cacheExchange, fetchExchange],
		fetchOptions: {
			credentials: 'include'
		}
	})
}
