import type { Serializable } from "$/types/general"
import type { PageProps as BasePageProps, UnitError } from "$/types/server"

export interface PageProps extends BasePageProps {
	parsedUnitError: UnitError & Serializable
}

// The `pageContext` that are available in both on the server-side and browser-side
export type PageContext = {
	Page: any
	pageProps: PageProps
	documentProps?: {
		title?: string
		description?: string
	}
	urlPathname?: string,
	routeParams?: {
		[key:string]: string
	}
}
