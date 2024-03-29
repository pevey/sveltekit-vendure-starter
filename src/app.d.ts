// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { SalunaConfig } from "../saluna.config"

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
	declare namespace svelteHTML {
		interface HTMLAttributes<T> {
			'on:clickOutside'?: CompositionEventHandler<T>
		}
	}
	interface Window {
		__URQL_DATA__: any
	}
}

export {}
