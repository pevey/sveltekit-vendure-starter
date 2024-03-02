import { gql } from '$lib/gql'

export const COLLECTION_FRAGMENT = gql(`
	fragment Collection on Collection {
		id
		name
		slug
		description
		featuredAsset {
			id
			preview
		}
	}
`)

export const GetCollection = gql(`
	query GetCollection($slug: String!) {
		collection(slug: $slug) {
			...Collection
		}
	}
`)

export const GetCollections = gql(`
	query GetCollections {
		collections {
			items {
				...Collection
			}
		}
	}
`)

export const GetCollectionProducts = gql(`
	query GetCollectionProducts($slug: String!, $skip: Int, $take: Int) {
		search(
		input: {
			collectionSlug: $slug,
			groupByProduct: true,
			skip: $skip,
			take: $take }
		) {
			totalItems
			items {
				productName
				slug
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
		}
	}
`)

export const GetTopLevelCollections = gql(`
	query GetTopLevelCollections {
		collections(options: { topLevelOnly: true }) {
			items {
				...Collection
			}
		}
	}
`)