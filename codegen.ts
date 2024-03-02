import type { CodegenConfig } from '@graphql-codegen/cli'
import 'dotenv/config'

const IS_DEV = process.env.APP_ENV === 'dev'

const config: CodegenConfig = {
	schema: IS_DEV? process.env.PUBLIC_SHOPAPI_DEV_URL: process.env.PUBLIC_SHOPAPI_PROD_URL,
	// documents: ['src/**/*.{ts,svelte,graphql.ts}', '!src/lib/gql/*'],
	documents: ['src/**/*.{ts,svelte,graphql.ts}', '!src/lib/gql/*', '!src/lib/server/**/*'],
	ignoreNoDocuments: true,
	generates: {
		'src/lib/gql/': {
			preset: 'client',
			presetConfig: {
				gqlTagName: 'gql',
				// fragmentMasking: false,
			},
			plugins: ['typescript'],
			config: {
				useTypeImports: true, // This is needed to avoid Vite/SvelteKit import errors
				scalars: {
					// This tells codegen that the `Money` scalar is a number
					Money: 'number',
				}
			}
		},
	}
}
export default config