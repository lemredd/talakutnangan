import { renderToString } from "@vue/server-renderer"
import { PageContextBuiltIn, escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr"

import type { PageContext } from "$/types/renderer"

import { createApp } from "#/app"
import ErrorPage from "#/_error.page.vue"
import logoUrl from "@assets/logo_bg_transparent.svg"

// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = [ "pageProps", "urlPathname", "routeParams" ]

async function render(pageContext: PageContextBuiltIn & PageContext) {
	// Modify the page to show for errors
	const isInErrorPage = pageContext.pageProps.parsedUnitError
		&& pageContext.urlParsed.pathname === "/"
	if (isInErrorPage) {
		pageContext.Page = ErrorPage
		pageContext.pageProps = {
			"is404": false,
			...pageContext.pageProps
		}
	}

	const app = createApp(pageContext)
	const appHtml = await renderToString(app)

	// See https://vite-plugin-ssr.com/head
	const { documentProps, pageProps } = pageContext as PageContext<"deserialized">

	let isDark = false
	if (pageProps.userProfile) {
		const { "data": userProfile } = pageProps.userProfile
		isDark = userProfile.prefersDark
	}

	const peerServerScript = pageProps.mustUsePeerServer
		? "https://unpkg.com/peerjs@1.4.5/dist/peerjs.min.js"
		: ""

	const title = documentProps && documentProps.title || "Talakutnangan"
	const desc = documentProps && documentProps.description || "A consultation platform"

	const documentHtml = escapeInject`<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<link rel="icon" href="${logoUrl}" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="description" content="${desc}" />
				<script defer src="${peerServerScript}"></script>
				<title>${title}</title>
			</head>
			<body class="${isDark ? "dark" : ""}">
				<div id="app">${dangerouslySkipEscape(appHtml)}</div>
			</body>
		</html>`

	const responseDocument = {
		documentHtml,
		"pageContext": {
			/*
			 * We can add some `pageContext` here, which is useful if we want to do page redirection
			 * Please see: https://vite-plugin-ssr.com/page-redirection
			 */
		}
	}

	if (pageContext.pageProps.parsedUnitError) {
		const rawStatus = pageContext.pageProps.parsedUnitError.status
		const parsedStatus = Number(rawStatus)
		if (!Number.isNaN(parsedStatus) && parsedStatus >= 400 && parsedStatus < 600) {
			responseDocument.pageContext = {
				"errorStatus": parsedStatus
			}
		}
	}

	return responseDocument
}

export { render }
