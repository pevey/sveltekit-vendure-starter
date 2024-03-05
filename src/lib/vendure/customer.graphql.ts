import { gql } from '$lib/gql'

export const Customer = gql(`
	fragment Customer on Customer {
		__typename
		id
		firstName
		lastName
		emailAddress
	}
`)

export const Address = gql(`
	fragment Address on Address {
		id
		fullName
		company
		streetLine1
		streetLine2
		city
		province
		postalCode
		country {
			code
			name
		}
		phoneNumber
		defaultShippingAddress
		defaultBillingAddress
	}
`)

export const GetCustomer = gql(`
	query GetCustomer {
		activeCustomer {
			...Customer
		}
	}
`)

export const SignIn = gql(`
	mutation LogIn($username: String!, $password: String!, $rememberMe: Boolean!) {
		login(username: $username, password: $password, rememberMe: $rememberMe) {
			... on CurrentUser {
				id
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`)

export const SignOut = gql(`
	mutation LogOut {
		logout {
			success
		}
	}
`)

export const SignUp = gql(`
	mutation Register($input: RegisterCustomerInput!) {
		registerCustomerAccount(input: $input) {
			... on Success {
				success
			}
			...on ErrorResult {
				errorCode
				message
			}
		}
	}
`)

export const VerifyEmail = gql(`
	mutation Verify($token: String!) {
		verifyCustomerAccount(token: $token) {
			...on CurrentUser {
				id
				identifier
			}
			...on ErrorResult {
				errorCode
				message
			}
		}
	}
`)

export const RequestPasswordReset = gql(`
	mutation RequestPasswordReset($emailAddress: String!) {
		requestPasswordReset(emailAddress: $emailAddress) {
			... on Success {
				success
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`)

export const ResetPassword = gql(`
	mutation ResetPassword($token: String! $password: String!) {
		resetPassword(token: $token password: $password) {
			...on CurrentUser {
				id
				identifier
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`)

export const GetCustomerOrders = gql(`
	query GetCustomerOrders {
		activeCustomer {
			orders {
				items {
					...Order
				}
				totalItems
			}
		}
	}
`)

export const GetCustomerAddresses = gql(`
	query GetCustomerAddresses {
		activeCustomer {
			addresses {
				...Address
			}
		}
	}
`)

export const CreateCustomerAddress = gql(`
	mutation CreateCustomerAddress($input: CreateAddressInput!) {
		createCustomerAddress(input: $input) {
			id
			fullName
			company
			streetLine1
			streetLine2
			city
			province
			postalCode
			country {
				id
				code
				name
			}
			phoneNumber
			defaultShippingAddress
			defaultBillingAddress
		}
	}
`)