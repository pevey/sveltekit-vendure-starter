import { gql } from '$lib/gql'

export const Order = gql(`
	fragment Order on Order {
		id
		code
		state
		lines {
			id
			quantity
			linePriceWithTax
			productVariant {
				id
				name
				sku
				product {
					slug
				}
			}
			featuredAsset {
				id
				preview
			}
		}
		orderPlacedAt
	}
`)

export const ActiveOrder = gql(`
	fragment ActiveOrder on Order {
		__typename
		id
		code
		state
		orderPlacedAt
		currencyCode
		totalQuantity
		subTotal
		shipping
		total
		totalWithTax
		taxSummary {
			description
			taxRate
			taxBase
			taxTotal
		}
		lines {
			id
			unitPrice
			unitPriceWithTax
			quantity
			linePrice
			linePriceWithTax
			productVariant {
				id
				name
				sku
				product {
					slug
				}
			}
			featuredAsset {
				id
				preview
			}
		}
		shippingLines {
			shippingMethod {
				id
				name
				description
			}
			priceWithTax
		}
		discounts {
			description
			amountWithTax
		}
		couponCodes
		promotions {
			id
			startsAt
			endsAt
			couponCode
			perCustomerUsageLimit
			usageLimit
			name
			description
			enabled
		}
		surcharges {
			description
			sku
			price
			priceWithTax
			taxRate
		}
		payments {
			id
			amount
			errorMessage
			method
			state
			transactionId
			createdAt
		}
		fulfillments {
			createdAt
			updatedAt
			lines {
				orderLine {
					id
					productVariant {
						id
						name
						sku
					}
				}
				quantity
			}
			state
			method
			trackingCode
		}
	}
`)

export const ShippingMethodQuote = gql(`
	fragment ShippingMethodQuote on ShippingMethodQuote {
		id
		price
		priceWithTax
		code
		name
		description
		metadata
	}
`)

export const GetOrderByCode = gql(`
	query GetOrderByCode($code: String!) {
		orderByCode(code: $code) {
			...ActiveOrder
		}
	}
`)

export const GetActiveOrder = gql(`
	query GetActiveOrder {
		activeOrder {
			...ActiveOrder
		}
	}
`)

export const AddItemToOrder = gql(`
	mutation AddItemToOrder($variantId: ID!, $quantity: Int!) {
		addItemToOrder(productVariantId: $variantId, quantity: $quantity) {
			__typename
			...ActiveOrder
			... on ErrorResult {
				errorCode
				message
			}
			... on InsufficientStockError {
				quantityAvailable
				order {
					...ActiveOrder
				}
			}
		}
	}
`)

export const RemoveOrderLine = gql(`
	mutation RemoveOrderLine($orderLineId: ID!) {
		removeOrderLine(orderLineId: $orderLineId) {
			...ActiveOrder
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`)

export const AdjustOrderLine = gql(`
	mutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {
		adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
			...ActiveOrder
			... on ErrorResult {
					errorCode
					message
			}
		}
	}
`)

export const AddOrderCouponCode = gql(`
	mutation AddOrderCouponCode($couponCode: String!) {
		applyCouponCode(couponCode: $couponCode) {
			...ActiveOrder
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`)

export const RemoveOrderCouponCode = gql(`
	mutation RemoveOrderCouponCode($couponCode: String!) {
		removeCouponCode(couponCode: $couponCode) {
			...ActiveOrder
		}
	}
`)

export const SetOrderCustomer = gql(`
	mutation SetCustomerForOrder($input: CreateCustomerInput!) {
		setCustomerForOrder(input: $input) {
			...on ErrorResult {
				errorCode
				message
			}
		}
	}
`)

export const SetOrderShippingAddress = gql(`
	mutation SetOrderShippingAddress($input: CreateAddressInput!) {
		setOrderShippingAddress(input: $input) {
			...on ErrorResult {
				errorCode
				message
			}
		}
	}
`)

export const GetOrderShippingMethods = gql(`
	query GetOrderShippingMethods {
		eligibleShippingMethods {
			...ShippingMethodQuote
		}
	}
`)

export const SetOrderShippingMethod = gql(`
	mutation SetOrderShippingMethod($id: [ID!]!) {
		setOrderShippingMethod(shippingMethodId: $id) {
			...ActiveOrder
			...on ErrorResult {
				errorCode
				message
			}
		}
	}
`)

export const GetOrderPaymentMethods = gql(`
	query GetOrderPaymentMethods {
		eligiblePaymentMethods {
			id
			name
			code
			isEligible
		}
	}
`)

export const CreateStripePaymentIntent = gql(`
	mutation CreateStripePaymentIntent {
		createStripePaymentIntent
	}
`)

export const GenerateBraintreeClientToken = gql(`
	query GenerateBraintreeClientToken($includeCustomerId: Boolean!) {
		generateBraintreeClientToken(includeCustomerId: $includeCustomerId)
	}
`)

export const AddOrderPayment = gql(`
	mutation AddOrderPayment($input: PaymentInput!) {
		addPaymentToOrder(input: $input) {
			...ActiveOrder
			...on ErrorResult {
				errorCode
				message
			}
		}
	}
`)

export const TransitionOrderToState = gql(`
	mutation TransitionOrderToState($state: String!) {
		transitionOrderToState(state: $state) {
			...ActiveOrder
			...on OrderStateTransitionError {
				errorCode
				message
				transitionError
				fromState
				toState
			}
		}
	}
`)

