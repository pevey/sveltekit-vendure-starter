/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n\tfragment Collection on Collection {\n\t\tid\n\t\tname\n\t\tslug\n\t\tdescription\n\t\tfeaturedAsset {\n\t\t\tid\n\t\t\tpreview\n\t\t}\n\t}\n": types.CollectionFragmentDoc,
    "\n\tquery GetCollection($slug: String!, $skip: Int, $take: Int) {\n\t\tcollection(slug: $slug) {\n\t\t\t...Collection\n\t\t}\n\t\tsearch(\n\t\t\tinput: {\n\t\t\t\tcollectionSlug: $slug,\n\t\t\t\tgroupByProduct: true,\n\t\t\t\tskip: $skip,\n\t\t\t\ttake: $take \n\t\t\t}\n\t\t) {\n\t\t\titems {\n\t\t\t\t...SearchResult\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n": types.GetCollectionDocument,
    "\n\tquery GetCollections($options: CollectionListOptions) {\n\t\tcollections {\n\t\t\titems {\n\t\t\t\t...Collection\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n": types.GetCollectionsDocument,
    "\n\tquery GetTopLevelCollections {\n\t\tcollections(options: { topLevelOnly: true }) {\n\t\t\titems {\n\t\t\t\t...Collection\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n": types.GetTopLevelCollectionsDocument,
    "\n\tfragment Customer on Customer {\n\t\t__typename\n\t\tid\n\t\tfirstName\n\t\tlastName\n\t\temailAddress\n\t}\n": types.CustomerFragmentDoc,
    "\n\tfragment Address on Address {\n\t\tid\n\t\tfullName\n\t\tcompany\n\t\tstreetLine1\n\t\tstreetLine2\n\t\tcity\n\t\tprovince\n\t\tpostalCode\n\t\tcountry {\n\t\t\tcode\n\t\t\tname\n\t\t}\n\t\tphoneNumber\n\t\tdefaultShippingAddress\n\t\tdefaultBillingAddress\n\t}\n": types.AddressFragmentDoc,
    "\n\tquery GetCustomer {\n\t\tactiveCustomer {\n\t\t\t...Customer\n\t\t}\n\t}\n": types.GetCustomerDocument,
    "\n\tmutation LogIn($username: String!, $password: String!, $rememberMe: Boolean!) {\n\t\tlogin(username: $username, password: $password, rememberMe: $rememberMe) {\n\t\t\t... on CurrentUser {\n\t\t\t\tid\n\t\t\t}\n\t\t\t... on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n": types.LogInDocument,
    "\n\tmutation LogOut {\n\t\tlogout {\n\t\t\tsuccess\n\t\t}\n\t}\n": types.LogOutDocument,
    "\n\tmutation Register($input: RegisterCustomerInput!) {\n\t\tregisterCustomerAccount(input: $input) {\n\t\t\t... on Success {\n\t\t\t\tsuccess\n\t\t\t}\n\t\t\t...on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n": types.RegisterDocument,
    "\n\tmutation VerifyCustomerAccount($token: String!) {\n\t\tverifyCustomerAccount(token: $token) {\n\t\t\t...on CurrentUser {\n\t\t\t\tid\n\t\t\t\tidentifier\n\t\t\t}\n\t\t\t...on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n": types.VerifyCustomerAccountDocument,
    "\n\tmutation RequestPasswordReset($emailAddress: String!) {\n\t\trequestPasswordReset(emailAddress: $emailAddress) {\n\t\t\t... on Success {\n\t\t\t\tsuccess\n\t\t\t}\n\t\t\t... on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n": types.RequestPasswordResetDocument,
    "\n\tmutation ResetPassword($token: String! $password: String!) {\n\t\tresetPassword(token: $token password: $password) {\n\t\t\t...on CurrentUser {\n\t\t\t\tid\n\t\t\t\tidentifier\n\t\t\t}\n\t\t\t... on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n": types.ResetPasswordDocument,
    "\n\tquery GetCustomerOrders {\n\t\tactiveCustomer {\n\t\t\torders {\n\t\t\t\titems {\n\t\t\t\t\t...Order\n\t\t\t\t}\n\t\t\t\ttotalItems\n\t\t\t}\n\t\t}\n\t}\n": types.GetCustomerOrdersDocument,
    "\n\tquery GetCustomerAddresses {\n\t\tactiveCustomer {\n\t\t\taddresses {\n\t\t\t\t...Address\n\t\t\t}\n\t\t}\n\t}\n": types.GetCustomerAddressesDocument,
    "\n\tmutation CreateCustomerAddress($input: CreateAddressInput!) {\n\t\tcreateCustomerAddress(input: $input) {\n\t\t\tid\n\t\t\tfullName\n\t\t\tcompany\n\t\t\tstreetLine1\n\t\t\tstreetLine2\n\t\t\tcity\n\t\t\tprovince\n\t\t\tpostalCode\n\t\t\tcountry {\n\t\t\t\tid\n\t\t\t\tcode\n\t\t\t\tname\n\t\t\t}\n\t\t\tphoneNumber\n\t\t\tdefaultShippingAddress\n\t\t\tdefaultBillingAddress\n\t\t}\n\t}\n": types.CreateCustomerAddressDocument,
    "\n\tfragment Order on Order {\n\t\tid\n\t\tcode\n\t\tstate\n\t\tlines {\n\t\t\tid\n\t\t\tquantity\n\t\t\tlinePriceWithTax\n\t\t\tproductVariant {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tsku\n\t\t\t\tproduct {\n\t\t\t\t\tslug\n\t\t\t\t}\n\t\t\t}\n\t\t\tfeaturedAsset {\n\t\t\t\tid\n\t\t\t\tpreview\n\t\t\t}\n\t\t}\n\t}\n": types.OrderFragmentDoc,
    "\n\tfragment UpdatedOrder on Order {\n\t\tid\n\t\tcode\n\t\tstate\n\t\ttotalQuantity\n\t\ttotalWithTax\n\t\tcurrencyCode\n\t\tlines {\n\t\t\tid\n\t\t\tunitPriceWithTax\n\t\t\tquantity\n\t\t\tlinePriceWithTax\n\t\t\tproductVariant {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t}\n": types.UpdatedOrderFragmentDoc,
    "\n\tfragment ActiveOrder on Order {\n\t\t__typename\n\t\tid\n\t\tcode\n\t\tcouponCodes\n\t\tstate\n\t\tcurrencyCode\n\t\ttotalQuantity\n\t\tsubTotal\n\t\tshipping\n\t\ttotal\n\t\ttotalWithTax\n\t\ttaxSummary {\n\t\t\tdescription\n\t\t\ttaxRate\n\t\t\ttaxBase\n\t\t\ttaxTotal\n\t\t}\n\t\tdiscounts {\n\t\t\tdescription\n\t\t\tamountWithTax\n\t\t}\n\t\tlines {\n\t\t\tid\n\t\t\tunitPrice\n\t\t\tunitPriceWithTax\n\t\t\tquantity\n\t\t\tlinePrice\n\t\t\tlinePriceWithTax\n\t\t\tproductVariant {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tsku\n\t\t\t\tproduct {\n\t\t\t\t\tslug\n\t\t\t\t}\n\t\t\t}\n\t\t\tfeaturedAsset {\n\t\t\t\tid\n\t\t\t\tpreview\n\t\t\t}\n\t\t}\n\t\tshippingLines {\n\t\t\tshippingMethod {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tdescription\n\t\t\t}\n\t\t\tpriceWithTax\n\t\t}\n\t}\n": types.ActiveOrderFragmentDoc,
    "\n\tquery GetOrderByCode($code: String!) {\n\t\torderByCode(code: $code) {\n\t\t\t...Order\n\t\t}\n\t}\n": types.GetOrderByCodeDocument,
    "\n\tquery GetActiveOrder {\n\t\tactiveOrder {\n\t\t\t...ActiveOrder\n\t\t}\n\t}\n": types.GetActiveOrderDocument,
    "\n\tmutation AddItemToOrder($variantId: ID!, $quantity: Int!) {\n\t\taddItemToOrder(productVariantId: $variantId, quantity: $quantity) {\n\t\t\t__typename\n\t\t\t...UpdatedOrder\n\t\t\t... on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t\t... on InsufficientStockError {\n\t\t\t\tquantityAvailable\n\t\t\t\torder {\n\t\t\t\t\t...UpdatedOrder\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": types.AddItemToOrderDocument,
    "\n\tmutation RemoveOrderLine($orderLineId: ID!) {\n\t\tremoveOrderLine(orderLineId: $orderLineId) {\n\t\t\t...ActiveOrder\n\t\t\t... on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n": types.RemoveOrderLineDocument,
    "\n\tmutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {\n\t\tadjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {\n\t\t\t...ActiveOrder\n\t\t\t... on ErrorResult {\n\t\t\t\t\terrorCode\n\t\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n": types.AdjustOrderLineDocument,
    "\n\tmutation AddOrderCouponCode($couponCode: String!) {\n\t\tapplyCouponCode(couponCode: $couponCode) {\n\t\t\t...ActiveOrder\n\t\t\t... on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n": types.AddOrderCouponCodeDocument,
    "\n\tmutation RemoveOrderCouponCode($couponCode: String!) {\n\t\tremoveCouponCode(couponCode: $couponCode) {\n\t\t\t...ActiveOrder\n\t\t}\n\t}\n": types.RemoveOrderCouponCodeDocument,
    "\n\tmutation SetCustomerForOrder($input: CreateCustomerInput!) {\n\t\tsetCustomerForOrder(input: $input) {\n\t\t\t...on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n": types.SetCustomerForOrderDocument,
    "\n\tquery GetOrderShippingMethods {\n\t\teligibleShippingMethods {\n\t\t\tid\n\t\t\tcode\n\t\t\tname\n\t\t\tprice\n\t\t\tdescription\n\t\t}\n\t}\n": types.GetOrderShippingMethodsDocument,
    "\n\tmutation SetOrderShippingAddress($input: CreateAddressInput!) {\n\t\tsetOrderShippingAddress(input: $input) {\n\t\t\t...on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n": types.SetOrderShippingAddressDocument,
    "\n\tmutation SetOrderShippingMethod($id: [ID!]!) {\n\t\tsetOrderShippingMethod(shippingMethodId: $id) {\n\t\t\t...ActiveOrder\n\t\t\t...on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n": types.SetOrderShippingMethodDocument,
    "\n\tquery GetOrderPaymentMethods {\n\t\teligiblePaymentMethods {\n\t\t\tid\n\t\t\tname\n\t\t\tcode\n\t\t\tisEligible\n\t\t}\n\t}\n": types.GetOrderPaymentMethodsDocument,
    "\n\tmutation CreateStripePaymentIntent {\n\t\tcreateStripePaymentIntent\n\t}\n": types.CreateStripePaymentIntentDocument,
    "\n\tmutation AddOrderPayment($input: PaymentInput!) {\n\t\taddPaymentToOrder(input: $input) {\n\t\t\t...ActiveOrder\n\t\t\t...on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n": types.AddOrderPaymentDocument,
    "\n\tmutation TransitionToState($state: String!) {\n\t\ttransitionOrderToState(state: $state) {\n\t\t\t...ActiveOrder\n\t\t\t...on OrderStateTransitionError {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t\ttransitionError\n\t\t\t\tfromState\n\t\t\t\ttoState\n\t\t\t}\n\t\t}\n\t}\n": types.TransitionToStateDocument,
    "\n\tfragment Product on Product {\n\t\tid\n\t\tname\n\t\tslug\n\t\tdescription\n\t\tfeaturedAsset {\n\t\t\tid\n\t\t\tpreview\n\t\t}\n\t\tvariants {\n\t\t\tid\n\t\t\tprice\n\t\t\tstockLevel\n\t\t}\n\t\tcustomFields {\n\t\t\tshortDescription\n\t\t}\n\t}\n": types.ProductFragmentDoc,
    "\n\tfragment ProductDetail on Product {\n\t\tid\n\t\tname\n\t\tslug\n\t\tdescription\n\t\tfeaturedAsset {\n\t\t\t...Asset\n\t\t}\n\t\tassets {\n\t\t\t...Asset\n\t\t}\n\t\tvariants {\n\t\t\tid\n\t\t\tname\n\t\t\tsku\n\t\t\tstockLevel\n\t\t\tcurrencyCode\n\t\t\tprice\n\t\t\tpriceWithTax\n\t\t\tfacetValues {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tfacet {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t\tfeaturedAsset {\n\t\t\t\t...Asset\n\t\t\t}\n\t\t\tassets {\n\t\t\t\t...Asset\n\t\t\t}\n\t\t}\n\t\tcustomFields {\n\t\t\tshortDescription\n\t\t}\n\t}\n": types.ProductDetailFragmentDoc,
    "\n\tfragment SearchResult on SearchResult {\n\t\tproductName\n\t\tslug\n\t\tdescription\n\t\tproductAsset {\n\t\t\tid\n\t\t\tpreview\n\t\t}\n\t\tprice {\n\t\t\t... on SinglePrice {\n\t\t\t\tvalue\n\t\t\t}\n\t\t\t... on PriceRange {\n\t\t\t\tmin\n\t\t\t\tmax\n\t\t\t}\n\t\t}\n\t\tcurrencyCode\n\t}\n": types.SearchResultFragmentDoc,
    "\n\tfragment Asset on Asset {\n\t\tid\n\t\tcreatedAt\n\t\tupdatedAt\n\t\tname\n\t\ttype\n\t\tfileSize\n\t\tmimeType\n\t\twidth\n\t\theight\n\t\tsource\n\t\tpreview\n\t\tfocalPoint {\n\t\t\tx\n\t\t\ty\n\t\t}\n\t\ttags {\n\t\t\tid\n\t\t\tvalue\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n": types.AssetFragmentDoc,
    "\n\tquery GetProducts($options: ProductListOptions) {\n\t\tproducts(options: $options) {\n\t\t\titems {\n\t\t\t\t...Product\t\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n": types.GetProductsDocument,
    "\n\tquery GetProduct($slug: String!) {\n\t\tproduct(slug: $slug) {\n\t\t\t...ProductDetail\n\t\t}\n\t}\n": types.GetProductDocument,
    "\n\tquery SearchProducts($input: SearchInput!) {\n\t\tsearch(input: $input) {\n\t\t\titems {\n\t\t\t\t...SearchResult\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n": types.SearchProductsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tfragment Collection on Collection {\n\t\tid\n\t\tname\n\t\tslug\n\t\tdescription\n\t\tfeaturedAsset {\n\t\t\tid\n\t\t\tpreview\n\t\t}\n\t}\n"): (typeof documents)["\n\tfragment Collection on Collection {\n\t\tid\n\t\tname\n\t\tslug\n\t\tdescription\n\t\tfeaturedAsset {\n\t\t\tid\n\t\t\tpreview\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetCollection($slug: String!, $skip: Int, $take: Int) {\n\t\tcollection(slug: $slug) {\n\t\t\t...Collection\n\t\t}\n\t\tsearch(\n\t\t\tinput: {\n\t\t\t\tcollectionSlug: $slug,\n\t\t\t\tgroupByProduct: true,\n\t\t\t\tskip: $skip,\n\t\t\t\ttake: $take \n\t\t\t}\n\t\t) {\n\t\t\titems {\n\t\t\t\t...SearchResult\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetCollection($slug: String!, $skip: Int, $take: Int) {\n\t\tcollection(slug: $slug) {\n\t\t\t...Collection\n\t\t}\n\t\tsearch(\n\t\t\tinput: {\n\t\t\t\tcollectionSlug: $slug,\n\t\t\t\tgroupByProduct: true,\n\t\t\t\tskip: $skip,\n\t\t\t\ttake: $take \n\t\t\t}\n\t\t) {\n\t\t\titems {\n\t\t\t\t...SearchResult\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetCollections($options: CollectionListOptions) {\n\t\tcollections {\n\t\t\titems {\n\t\t\t\t...Collection\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetCollections($options: CollectionListOptions) {\n\t\tcollections {\n\t\t\titems {\n\t\t\t\t...Collection\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetTopLevelCollections {\n\t\tcollections(options: { topLevelOnly: true }) {\n\t\t\titems {\n\t\t\t\t...Collection\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetTopLevelCollections {\n\t\tcollections(options: { topLevelOnly: true }) {\n\t\t\titems {\n\t\t\t\t...Collection\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tfragment Customer on Customer {\n\t\t__typename\n\t\tid\n\t\tfirstName\n\t\tlastName\n\t\temailAddress\n\t}\n"): (typeof documents)["\n\tfragment Customer on Customer {\n\t\t__typename\n\t\tid\n\t\tfirstName\n\t\tlastName\n\t\temailAddress\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tfragment Address on Address {\n\t\tid\n\t\tfullName\n\t\tcompany\n\t\tstreetLine1\n\t\tstreetLine2\n\t\tcity\n\t\tprovince\n\t\tpostalCode\n\t\tcountry {\n\t\t\tcode\n\t\t\tname\n\t\t}\n\t\tphoneNumber\n\t\tdefaultShippingAddress\n\t\tdefaultBillingAddress\n\t}\n"): (typeof documents)["\n\tfragment Address on Address {\n\t\tid\n\t\tfullName\n\t\tcompany\n\t\tstreetLine1\n\t\tstreetLine2\n\t\tcity\n\t\tprovince\n\t\tpostalCode\n\t\tcountry {\n\t\t\tcode\n\t\t\tname\n\t\t}\n\t\tphoneNumber\n\t\tdefaultShippingAddress\n\t\tdefaultBillingAddress\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetCustomer {\n\t\tactiveCustomer {\n\t\t\t...Customer\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetCustomer {\n\t\tactiveCustomer {\n\t\t\t...Customer\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation LogIn($username: String!, $password: String!, $rememberMe: Boolean!) {\n\t\tlogin(username: $username, password: $password, rememberMe: $rememberMe) {\n\t\t\t... on CurrentUser {\n\t\t\t\tid\n\t\t\t}\n\t\t\t... on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation LogIn($username: String!, $password: String!, $rememberMe: Boolean!) {\n\t\tlogin(username: $username, password: $password, rememberMe: $rememberMe) {\n\t\t\t... on CurrentUser {\n\t\t\t\tid\n\t\t\t}\n\t\t\t... on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation LogOut {\n\t\tlogout {\n\t\t\tsuccess\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation LogOut {\n\t\tlogout {\n\t\t\tsuccess\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation Register($input: RegisterCustomerInput!) {\n\t\tregisterCustomerAccount(input: $input) {\n\t\t\t... on Success {\n\t\t\t\tsuccess\n\t\t\t}\n\t\t\t...on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation Register($input: RegisterCustomerInput!) {\n\t\tregisterCustomerAccount(input: $input) {\n\t\t\t... on Success {\n\t\t\t\tsuccess\n\t\t\t}\n\t\t\t...on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation VerifyCustomerAccount($token: String!) {\n\t\tverifyCustomerAccount(token: $token) {\n\t\t\t...on CurrentUser {\n\t\t\t\tid\n\t\t\t\tidentifier\n\t\t\t}\n\t\t\t...on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation VerifyCustomerAccount($token: String!) {\n\t\tverifyCustomerAccount(token: $token) {\n\t\t\t...on CurrentUser {\n\t\t\t\tid\n\t\t\t\tidentifier\n\t\t\t}\n\t\t\t...on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation RequestPasswordReset($emailAddress: String!) {\n\t\trequestPasswordReset(emailAddress: $emailAddress) {\n\t\t\t... on Success {\n\t\t\t\tsuccess\n\t\t\t}\n\t\t\t... on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation RequestPasswordReset($emailAddress: String!) {\n\t\trequestPasswordReset(emailAddress: $emailAddress) {\n\t\t\t... on Success {\n\t\t\t\tsuccess\n\t\t\t}\n\t\t\t... on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation ResetPassword($token: String! $password: String!) {\n\t\tresetPassword(token: $token password: $password) {\n\t\t\t...on CurrentUser {\n\t\t\t\tid\n\t\t\t\tidentifier\n\t\t\t}\n\t\t\t... on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation ResetPassword($token: String! $password: String!) {\n\t\tresetPassword(token: $token password: $password) {\n\t\t\t...on CurrentUser {\n\t\t\t\tid\n\t\t\t\tidentifier\n\t\t\t}\n\t\t\t... on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetCustomerOrders {\n\t\tactiveCustomer {\n\t\t\torders {\n\t\t\t\titems {\n\t\t\t\t\t...Order\n\t\t\t\t}\n\t\t\t\ttotalItems\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetCustomerOrders {\n\t\tactiveCustomer {\n\t\t\torders {\n\t\t\t\titems {\n\t\t\t\t\t...Order\n\t\t\t\t}\n\t\t\t\ttotalItems\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetCustomerAddresses {\n\t\tactiveCustomer {\n\t\t\taddresses {\n\t\t\t\t...Address\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetCustomerAddresses {\n\t\tactiveCustomer {\n\t\t\taddresses {\n\t\t\t\t...Address\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation CreateCustomerAddress($input: CreateAddressInput!) {\n\t\tcreateCustomerAddress(input: $input) {\n\t\t\tid\n\t\t\tfullName\n\t\t\tcompany\n\t\t\tstreetLine1\n\t\t\tstreetLine2\n\t\t\tcity\n\t\t\tprovince\n\t\t\tpostalCode\n\t\t\tcountry {\n\t\t\t\tid\n\t\t\t\tcode\n\t\t\t\tname\n\t\t\t}\n\t\t\tphoneNumber\n\t\t\tdefaultShippingAddress\n\t\t\tdefaultBillingAddress\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation CreateCustomerAddress($input: CreateAddressInput!) {\n\t\tcreateCustomerAddress(input: $input) {\n\t\t\tid\n\t\t\tfullName\n\t\t\tcompany\n\t\t\tstreetLine1\n\t\t\tstreetLine2\n\t\t\tcity\n\t\t\tprovince\n\t\t\tpostalCode\n\t\t\tcountry {\n\t\t\t\tid\n\t\t\t\tcode\n\t\t\t\tname\n\t\t\t}\n\t\t\tphoneNumber\n\t\t\tdefaultShippingAddress\n\t\t\tdefaultBillingAddress\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tfragment Order on Order {\n\t\tid\n\t\tcode\n\t\tstate\n\t\tlines {\n\t\t\tid\n\t\t\tquantity\n\t\t\tlinePriceWithTax\n\t\t\tproductVariant {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tsku\n\t\t\t\tproduct {\n\t\t\t\t\tslug\n\t\t\t\t}\n\t\t\t}\n\t\t\tfeaturedAsset {\n\t\t\t\tid\n\t\t\t\tpreview\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tfragment Order on Order {\n\t\tid\n\t\tcode\n\t\tstate\n\t\tlines {\n\t\t\tid\n\t\t\tquantity\n\t\t\tlinePriceWithTax\n\t\t\tproductVariant {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tsku\n\t\t\t\tproduct {\n\t\t\t\t\tslug\n\t\t\t\t}\n\t\t\t}\n\t\t\tfeaturedAsset {\n\t\t\t\tid\n\t\t\t\tpreview\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tfragment UpdatedOrder on Order {\n\t\tid\n\t\tcode\n\t\tstate\n\t\ttotalQuantity\n\t\ttotalWithTax\n\t\tcurrencyCode\n\t\tlines {\n\t\t\tid\n\t\t\tunitPriceWithTax\n\t\t\tquantity\n\t\t\tlinePriceWithTax\n\t\t\tproductVariant {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tfragment UpdatedOrder on Order {\n\t\tid\n\t\tcode\n\t\tstate\n\t\ttotalQuantity\n\t\ttotalWithTax\n\t\tcurrencyCode\n\t\tlines {\n\t\t\tid\n\t\t\tunitPriceWithTax\n\t\t\tquantity\n\t\t\tlinePriceWithTax\n\t\t\tproductVariant {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tfragment ActiveOrder on Order {\n\t\t__typename\n\t\tid\n\t\tcode\n\t\tcouponCodes\n\t\tstate\n\t\tcurrencyCode\n\t\ttotalQuantity\n\t\tsubTotal\n\t\tshipping\n\t\ttotal\n\t\ttotalWithTax\n\t\ttaxSummary {\n\t\t\tdescription\n\t\t\ttaxRate\n\t\t\ttaxBase\n\t\t\ttaxTotal\n\t\t}\n\t\tdiscounts {\n\t\t\tdescription\n\t\t\tamountWithTax\n\t\t}\n\t\tlines {\n\t\t\tid\n\t\t\tunitPrice\n\t\t\tunitPriceWithTax\n\t\t\tquantity\n\t\t\tlinePrice\n\t\t\tlinePriceWithTax\n\t\t\tproductVariant {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tsku\n\t\t\t\tproduct {\n\t\t\t\t\tslug\n\t\t\t\t}\n\t\t\t}\n\t\t\tfeaturedAsset {\n\t\t\t\tid\n\t\t\t\tpreview\n\t\t\t}\n\t\t}\n\t\tshippingLines {\n\t\t\tshippingMethod {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tdescription\n\t\t\t}\n\t\t\tpriceWithTax\n\t\t}\n\t}\n"): (typeof documents)["\n\tfragment ActiveOrder on Order {\n\t\t__typename\n\t\tid\n\t\tcode\n\t\tcouponCodes\n\t\tstate\n\t\tcurrencyCode\n\t\ttotalQuantity\n\t\tsubTotal\n\t\tshipping\n\t\ttotal\n\t\ttotalWithTax\n\t\ttaxSummary {\n\t\t\tdescription\n\t\t\ttaxRate\n\t\t\ttaxBase\n\t\t\ttaxTotal\n\t\t}\n\t\tdiscounts {\n\t\t\tdescription\n\t\t\tamountWithTax\n\t\t}\n\t\tlines {\n\t\t\tid\n\t\t\tunitPrice\n\t\t\tunitPriceWithTax\n\t\t\tquantity\n\t\t\tlinePrice\n\t\t\tlinePriceWithTax\n\t\t\tproductVariant {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tsku\n\t\t\t\tproduct {\n\t\t\t\t\tslug\n\t\t\t\t}\n\t\t\t}\n\t\t\tfeaturedAsset {\n\t\t\t\tid\n\t\t\t\tpreview\n\t\t\t}\n\t\t}\n\t\tshippingLines {\n\t\t\tshippingMethod {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tdescription\n\t\t\t}\n\t\t\tpriceWithTax\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetOrderByCode($code: String!) {\n\t\torderByCode(code: $code) {\n\t\t\t...Order\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetOrderByCode($code: String!) {\n\t\torderByCode(code: $code) {\n\t\t\t...Order\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetActiveOrder {\n\t\tactiveOrder {\n\t\t\t...ActiveOrder\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetActiveOrder {\n\t\tactiveOrder {\n\t\t\t...ActiveOrder\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation AddItemToOrder($variantId: ID!, $quantity: Int!) {\n\t\taddItemToOrder(productVariantId: $variantId, quantity: $quantity) {\n\t\t\t__typename\n\t\t\t...UpdatedOrder\n\t\t\t... on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t\t... on InsufficientStockError {\n\t\t\t\tquantityAvailable\n\t\t\t\torder {\n\t\t\t\t\t...UpdatedOrder\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation AddItemToOrder($variantId: ID!, $quantity: Int!) {\n\t\taddItemToOrder(productVariantId: $variantId, quantity: $quantity) {\n\t\t\t__typename\n\t\t\t...UpdatedOrder\n\t\t\t... on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t\t... on InsufficientStockError {\n\t\t\t\tquantityAvailable\n\t\t\t\torder {\n\t\t\t\t\t...UpdatedOrder\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation RemoveOrderLine($orderLineId: ID!) {\n\t\tremoveOrderLine(orderLineId: $orderLineId) {\n\t\t\t...ActiveOrder\n\t\t\t... on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation RemoveOrderLine($orderLineId: ID!) {\n\t\tremoveOrderLine(orderLineId: $orderLineId) {\n\t\t\t...ActiveOrder\n\t\t\t... on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {\n\t\tadjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {\n\t\t\t...ActiveOrder\n\t\t\t... on ErrorResult {\n\t\t\t\t\terrorCode\n\t\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {\n\t\tadjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {\n\t\t\t...ActiveOrder\n\t\t\t... on ErrorResult {\n\t\t\t\t\terrorCode\n\t\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation AddOrderCouponCode($couponCode: String!) {\n\t\tapplyCouponCode(couponCode: $couponCode) {\n\t\t\t...ActiveOrder\n\t\t\t... on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation AddOrderCouponCode($couponCode: String!) {\n\t\tapplyCouponCode(couponCode: $couponCode) {\n\t\t\t...ActiveOrder\n\t\t\t... on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation RemoveOrderCouponCode($couponCode: String!) {\n\t\tremoveCouponCode(couponCode: $couponCode) {\n\t\t\t...ActiveOrder\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation RemoveOrderCouponCode($couponCode: String!) {\n\t\tremoveCouponCode(couponCode: $couponCode) {\n\t\t\t...ActiveOrder\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation SetCustomerForOrder($input: CreateCustomerInput!) {\n\t\tsetCustomerForOrder(input: $input) {\n\t\t\t...on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation SetCustomerForOrder($input: CreateCustomerInput!) {\n\t\tsetCustomerForOrder(input: $input) {\n\t\t\t...on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetOrderShippingMethods {\n\t\teligibleShippingMethods {\n\t\t\tid\n\t\t\tcode\n\t\t\tname\n\t\t\tprice\n\t\t\tdescription\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetOrderShippingMethods {\n\t\teligibleShippingMethods {\n\t\t\tid\n\t\t\tcode\n\t\t\tname\n\t\t\tprice\n\t\t\tdescription\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation SetOrderShippingAddress($input: CreateAddressInput!) {\n\t\tsetOrderShippingAddress(input: $input) {\n\t\t\t...on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation SetOrderShippingAddress($input: CreateAddressInput!) {\n\t\tsetOrderShippingAddress(input: $input) {\n\t\t\t...on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation SetOrderShippingMethod($id: [ID!]!) {\n\t\tsetOrderShippingMethod(shippingMethodId: $id) {\n\t\t\t...ActiveOrder\n\t\t\t...on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation SetOrderShippingMethod($id: [ID!]!) {\n\t\tsetOrderShippingMethod(shippingMethodId: $id) {\n\t\t\t...ActiveOrder\n\t\t\t...on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetOrderPaymentMethods {\n\t\teligiblePaymentMethods {\n\t\t\tid\n\t\t\tname\n\t\t\tcode\n\t\t\tisEligible\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetOrderPaymentMethods {\n\t\teligiblePaymentMethods {\n\t\t\tid\n\t\t\tname\n\t\t\tcode\n\t\t\tisEligible\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation CreateStripePaymentIntent {\n\t\tcreateStripePaymentIntent\n\t}\n"): (typeof documents)["\n\tmutation CreateStripePaymentIntent {\n\t\tcreateStripePaymentIntent\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation AddOrderPayment($input: PaymentInput!) {\n\t\taddPaymentToOrder(input: $input) {\n\t\t\t...ActiveOrder\n\t\t\t...on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation AddOrderPayment($input: PaymentInput!) {\n\t\taddPaymentToOrder(input: $input) {\n\t\t\t...ActiveOrder\n\t\t\t...on ErrorResult {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation TransitionToState($state: String!) {\n\t\ttransitionOrderToState(state: $state) {\n\t\t\t...ActiveOrder\n\t\t\t...on OrderStateTransitionError {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t\ttransitionError\n\t\t\t\tfromState\n\t\t\t\ttoState\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation TransitionToState($state: String!) {\n\t\ttransitionOrderToState(state: $state) {\n\t\t\t...ActiveOrder\n\t\t\t...on OrderStateTransitionError {\n\t\t\t\terrorCode\n\t\t\t\tmessage\n\t\t\t\ttransitionError\n\t\t\t\tfromState\n\t\t\t\ttoState\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tfragment Product on Product {\n\t\tid\n\t\tname\n\t\tslug\n\t\tdescription\n\t\tfeaturedAsset {\n\t\t\tid\n\t\t\tpreview\n\t\t}\n\t\tvariants {\n\t\t\tid\n\t\t\tprice\n\t\t\tstockLevel\n\t\t}\n\t\tcustomFields {\n\t\t\tshortDescription\n\t\t}\n\t}\n"): (typeof documents)["\n\tfragment Product on Product {\n\t\tid\n\t\tname\n\t\tslug\n\t\tdescription\n\t\tfeaturedAsset {\n\t\t\tid\n\t\t\tpreview\n\t\t}\n\t\tvariants {\n\t\t\tid\n\t\t\tprice\n\t\t\tstockLevel\n\t\t}\n\t\tcustomFields {\n\t\t\tshortDescription\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tfragment ProductDetail on Product {\n\t\tid\n\t\tname\n\t\tslug\n\t\tdescription\n\t\tfeaturedAsset {\n\t\t\t...Asset\n\t\t}\n\t\tassets {\n\t\t\t...Asset\n\t\t}\n\t\tvariants {\n\t\t\tid\n\t\t\tname\n\t\t\tsku\n\t\t\tstockLevel\n\t\t\tcurrencyCode\n\t\t\tprice\n\t\t\tpriceWithTax\n\t\t\tfacetValues {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tfacet {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t\tfeaturedAsset {\n\t\t\t\t...Asset\n\t\t\t}\n\t\t\tassets {\n\t\t\t\t...Asset\n\t\t\t}\n\t\t}\n\t\tcustomFields {\n\t\t\tshortDescription\n\t\t}\n\t}\n"): (typeof documents)["\n\tfragment ProductDetail on Product {\n\t\tid\n\t\tname\n\t\tslug\n\t\tdescription\n\t\tfeaturedAsset {\n\t\t\t...Asset\n\t\t}\n\t\tassets {\n\t\t\t...Asset\n\t\t}\n\t\tvariants {\n\t\t\tid\n\t\t\tname\n\t\t\tsku\n\t\t\tstockLevel\n\t\t\tcurrencyCode\n\t\t\tprice\n\t\t\tpriceWithTax\n\t\t\tfacetValues {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tfacet {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t\tfeaturedAsset {\n\t\t\t\t...Asset\n\t\t\t}\n\t\t\tassets {\n\t\t\t\t...Asset\n\t\t\t}\n\t\t}\n\t\tcustomFields {\n\t\t\tshortDescription\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tfragment SearchResult on SearchResult {\n\t\tproductName\n\t\tslug\n\t\tdescription\n\t\tproductAsset {\n\t\t\tid\n\t\t\tpreview\n\t\t}\n\t\tprice {\n\t\t\t... on SinglePrice {\n\t\t\t\tvalue\n\t\t\t}\n\t\t\t... on PriceRange {\n\t\t\t\tmin\n\t\t\t\tmax\n\t\t\t}\n\t\t}\n\t\tcurrencyCode\n\t}\n"): (typeof documents)["\n\tfragment SearchResult on SearchResult {\n\t\tproductName\n\t\tslug\n\t\tdescription\n\t\tproductAsset {\n\t\t\tid\n\t\t\tpreview\n\t\t}\n\t\tprice {\n\t\t\t... on SinglePrice {\n\t\t\t\tvalue\n\t\t\t}\n\t\t\t... on PriceRange {\n\t\t\t\tmin\n\t\t\t\tmax\n\t\t\t}\n\t\t}\n\t\tcurrencyCode\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tfragment Asset on Asset {\n\t\tid\n\t\tcreatedAt\n\t\tupdatedAt\n\t\tname\n\t\ttype\n\t\tfileSize\n\t\tmimeType\n\t\twidth\n\t\theight\n\t\tsource\n\t\tpreview\n\t\tfocalPoint {\n\t\t\tx\n\t\t\ty\n\t\t}\n\t\ttags {\n\t\t\tid\n\t\t\tvalue\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n"): (typeof documents)["\n\tfragment Asset on Asset {\n\t\tid\n\t\tcreatedAt\n\t\tupdatedAt\n\t\tname\n\t\ttype\n\t\tfileSize\n\t\tmimeType\n\t\twidth\n\t\theight\n\t\tsource\n\t\tpreview\n\t\tfocalPoint {\n\t\t\tx\n\t\t\ty\n\t\t}\n\t\ttags {\n\t\t\tid\n\t\t\tvalue\n\t\t\tcreatedAt\n\t\t\tupdatedAt\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetProducts($options: ProductListOptions) {\n\t\tproducts(options: $options) {\n\t\t\titems {\n\t\t\t\t...Product\t\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetProducts($options: ProductListOptions) {\n\t\tproducts(options: $options) {\n\t\t\titems {\n\t\t\t\t...Product\t\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetProduct($slug: String!) {\n\t\tproduct(slug: $slug) {\n\t\t\t...ProductDetail\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetProduct($slug: String!) {\n\t\tproduct(slug: $slug) {\n\t\t\t...ProductDetail\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery SearchProducts($input: SearchInput!) {\n\t\tsearch(input: $input) {\n\t\t\titems {\n\t\t\t\t...SearchResult\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery SearchProducts($input: SearchInput!) {\n\t\tsearch(input: $input) {\n\t\t\titems {\n\t\t\t\t...SearchResult\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;