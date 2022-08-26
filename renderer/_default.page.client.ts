import "virtual:windi.css"
import type { PageContextBuiltInClient } from "vite-plugin-ssr/client"
import type { PageContext } from "$/types/renderer"

import { createApp } from "#/app"
import ErrorPage from "#/_error.page.vue"

// eslint-disable-next-line require-await
async function render(pageContext: PageContextBuiltInClient & PageContext) {
	if (pageContext.pageProps.parsedUnitError === null && pageContext.urlPathname === "/") {
		pageContext.Page = ErrorPage
		pageContext.pageProps = {
			...pageContext.pageProps,
			"is404": false
		}
	}

	const app = createApp(pageContext)
	app.mount("#app")
}

export { render }
