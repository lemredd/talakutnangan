import { renderToString } from "@vue/server-renderer"
import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr"
import { createApp } from "./app"
import logoUrl from "@assets/logo_bg_transparent.svg"
import type { PageContext } from "./types"
import type { PageContextBuiltIn } from "vite-plugin-ssr"

export { render }
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ["pageProps", "urlPathname", "routeParams", "state", "_", "render"]

async function render(pageContext: PageContextBuiltIn & PageContext) {
	const app = createApp(pageContext)
	const appHtml = await renderToString(app)

	// See https://vite-plugin-ssr.com/head
	const { documentProps } = pageContext
	const title = (documentProps && documentProps.title) || "Vite SSR app"
	const desc = (documentProps && documentProps.description) || "App using Vite + vite-plugin-ssr"

	const documentHtml = escapeInject`<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<link rel="icon" href="${logoUrl}" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="description" content="${desc}" />
				<script defer src="https://unpkg.com/peerjs@1.4.5/dist/peerjs.min.js"></script>
				<title>${title}</title>
			</head>
			<body>
				<div id="app">${dangerouslySkipEscape(appHtml)}</div>
			</body>
		</html>`

	return {
		documentHtml,
		pageContext: {
			// We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
		},
	}
}
