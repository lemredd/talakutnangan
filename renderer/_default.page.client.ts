import "virtual:windi.css"
import type { PageContextBuiltInClient } from "vite-plugin-ssr/client"

import type { PageContext } from "#/types"

import { createApp } from "#/app"
import ErrorPage from "#/_error.page.vue"

export { render }

async function render(pageContext: PageContextBuiltInClient & PageContext) {
	if (pageContext.pageProps.parsedUnitError) {
		pageContext.Page = ErrorPage
		pageContext.pageProps = {
			"is404": false,
			...pageContext.pageProps
		}
	}

	const app = createApp(pageContext)
	app.mount("#app")
}
