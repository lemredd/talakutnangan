import { createPageRenderer } from "vite-plugin-ssr"
import type { Express as ExpressApp } from "express"
import { static as serveStaticFiles, Router as createRouter } from "express"

import { PageRequest } from "!/types/hybrid"
import { Environment } from "!/types/independent"
import { Response, NextFunction } from "!/types/dependent"

import getRoot from "!/helpers/get_root"
import getEnvironment from "!/helpers/get_environment"
import { renderPage } from "vite-plugin-ssr/dist/cjs/node/renderPage"

type PageRenderer = typeof renderPage

let pageRenderer: PageRenderer|null = null

export default async function(app: ExpressApp) {
	const root = getRoot()
	const isProduction = (
		getEnvironment() === Environment.Production
		|| getEnvironment() === Environment.IntegrationTest
	)

	let viteDevServer

	if (isProduction) {
		app.use(serveStaticFiles(`${root}/dist/client`))
	} else {
		const vite = require("vite")
		viteDevServer = await vite.createServer({
			root,
			server: { middlewareMode: "ssr" },
		})
		app.use(viteDevServer.middlewares)
	}

	if (pageRenderer === null) {
		pageRenderer = createPageRenderer({ viteDevServer, isProduction, root })
	}

	const renderPage = pageRenderer

	const router = createRouter()
	// @ts-ignore
	router.get("*", async (request: PageRequest, response: Response, next: NextFunction) => {
		const url = request.originalUrl
		const pageContextInit = {
			url,
			pageProps: request.clientPayload
		}
		const pageContext = await renderPage(pageContextInit)
		const { httpResponse } = pageContext
		if (!httpResponse) return next()
		const { body, statusCode, contentType } = httpResponse
		response.status(statusCode).type(contentType).send(body)
	})

	return router
}
