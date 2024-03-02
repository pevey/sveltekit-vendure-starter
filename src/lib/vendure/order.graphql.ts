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
	}
`)

export const UpdatedOrder = gql(`
	fragment UpdatedOrder on Order {
		id
		code
		state
		totalQuantity
		totalWithTax
		currencyCode
		lines {
			id
			unitPriceWithTax
			quantity
			linePriceWithTax
			productVariant {
				id
				name
			}
		}
	}
`)

export const ActiveOrder = gql(`
	fragment ActiveOrder on Order {
		__typename
		id
		code
		couponCodes
		state
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
		discounts {
			description
			amountWithTax
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
	}
`)

export const GetOrderByCode = gql(`
	query GetOrderByCode($code: String!) {
		orderByCode(code: $code) {
			...Order
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

export const AddCartLine = gql(`
	mutation AddItemToOrder($variantId: ID!, $quantity: Int!) {
		addItemToOrder(productVariantId: $variantId, quantity: $quantity) {
			__typename
			...UpdatedOrder
			... on ErrorResult {
				errorCode
				message
			}
			... on InsufficientStockError {
				quantityAvailable
				order {
					...UpdatedOrder
				}
			}
		}
	}
`)

export const RemoveCartLine = gql(`
	mutation RemoveItemFromOrder($orderLineId: ID!) {
		removeOrderLine(orderLineId: $orderLineId) {
			...ActiveOrder
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`)

export const UpdateCartLine = gql(`
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

export const GetOrderShippingMethods = gql(`
	query GetOrderShippingMethods {
		eligibleShippingMethods {
			id
			code
			name
			price
			description
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
	mutation TransitionToState($state: String!) {
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

