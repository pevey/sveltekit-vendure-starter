import { type Writable, writable } from 'svelte/store'
import type { FragmentType } from '$lib/gql'
import { ActiveOrder, Customer } from '$lib/vendure'

export const user: Writable<FragmentType<typeof Customer>|null> = writable()

export const cart: Writable<FragmentType<typeof ActiveOrder>|null> = writable()