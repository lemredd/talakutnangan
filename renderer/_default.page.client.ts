import "virtual:windi.css"
import { getPage } from "vite-plugin-ssr/client"
import type { PageContextBuiltInClient } from "vite-plugin-ssr/client"

import type { PageContext } from "#/types"

import { createApp } from "#/app"
import ErrorPage from "#/_error.page.vue"

hydrate()

async function hydrate() {
	// We do Server Routing, but we can also do Client Routing by using `useClientRouter()`
	// instead of `getPage()`, see https://vite-plugin-ssr.com/useClientRouter
	const pageContext = await getPage<PageContextBuiltInClient & PageContext>()

	if (pageContext.pageProps.parsedUnitError) {
		pageContext.Page = ErrorPage
		pageContext.pageProps = {
			is404: false,
			...pageContext.pageProps
		}
	}

	const app = createApp(pageContext)
	app.mount("#app")
}
