import type { Serializable } from "$/types/general"
import type { Format } from "$/types/documents/base"
import type { PageProps as BasePageProps, AdditionalPropNames, UnitError } from "$/types/server"

export type PageProps<
	T extends Format = "serialized",
	U extends AdditionalPropNames<T> = "userProfile"
> = BasePageProps<T, U> & {
	parsedUnitError: UnitError & Serializable
}

// The `pageContext` that are available in both on the server-side and browser-side
export type PageContext<
	T extends Format = "serialized",
	U extends AdditionalPropNames<T> = "userProfile"
> = {
	Page: any
	pageProps: PageProps<T, U>
	documentProps?: {
		title?: string
		description?: string
	}
	urlPathname?: string,
	routeParams?: {
		[key:string]: string
	}
}
