import { gql } from '$lib/gql'

export const Product = gql(`
	fragment Product on Product {
		id
		name
		slug
		description
		featuredAsset {
			id
			preview
		}
		variants {
			id
			price
			stockLevel
		}
		customFields {
			shortDescription
		}
	}
`)

export const ProductDetail = gql(`
	fragment ProductDetail on Product {
		id
		name
		slug
		description
		featuredAsset {
			...Asset
		}
		assets {
			...Asset
		}
		variants {
			id
			name
			sku
			stockLevel
			currencyCode
			price
			priceWithTax
			facetValues {
				id
				name
				facet {
					id
					name
				}
			}
			featuredAsset {
				...Asset
			}
			assets {
				...Asset
			}
		}
		# customFields {
		# 	shortDescription
		# }
	}
`)

export const SearchResult = gql(`
	fragment SearchResult on SearchResult {
		productName
		slug
		description
		productAsset {
			id
			preview
		}
		price {
			... on SinglePrice {
				value
			}
			... on PriceRange {
				min
				max
			}
		}
		currencyCode
	}
`)

export const Asset = gql(`
	fragment Asset on Asset {
		id
		createdAt
		updatedAt
		name
		type
		fileSize
		mimeType
		width
		height
		source
		preview
		focalPoint {
			x
			y
		}
		tags {
			id
			value
			createdAt
			updatedAt
		}
	}
`)

export const GetProducts = gql(`
	query GetProducts($options: ProductListOptions) {
		products(options: $options) {
			items {
				...Product	
			}
			totalItems
		}
	}
`)

export const GetProduct = gql(`
	query GetProduct($slug: String!) {
		product(slug: $slug) {
			...ProductDetail
		}
	}
`)

export const SearchProducts = gql(`
	query SearchProducts($input: SearchInput!) {
		search(input: $input) {
			items {
				...SearchResult
			}
			totalItems
		}
	}
`)