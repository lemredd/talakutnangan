import { Buffer } from "buffer"
import serveStaticFiles from "sirv"
import { renderPage } from "vite-plugin-ssr"
import { Router as createRouter, Express as ExpressApp } from "express"

import { PageRequest } from "!/types/hybrid"
import { Environment, UnitError } from "$/types/server"
import { Response, NextFunction } from "!/types/dependent"

import Log from "$!/singletons/log"
import getRoot from "$!/helpers/get_root"
import getEnvironment from "$/helpers/get_environment"
import isUndefined from "$/type_guards/is_undefined"

export default async function(app: ExpressApp) {
	const root = getRoot()
	const isProduction
		= getEnvironment() === Environment.Production
		|| getEnvironment() === Environment.IntegrationTest


	if (isProduction) {
		app.use(serveStaticFiles(`${root}/dist/client`))
	} else {
		const { createServer } = require("vite")
		const viteDevServer = await createServer({
			root,
			"server": { "middlewareMode": true }
		})
		app.use(viteDevServer.middlewares)
	}

	const router = createRouter()
	// @ts-ignore
	router.get("*", async(request: PageRequest, response: Response, next: NextFunction): void => {
		if (!request.transaction.hasDestroyed) {
			await request.transaction.destroyIneffectually()

			Log.errorMessage(
				"transaction",
				`Route "${
					request.url
				}" has no page middleware. Therefore, transaction has ended ineffectually.`
			)
		}

		const { "error": rawError = null } = request.query
		// ! There is a possiblity of crashing the server using the query
		let parsedUnitError = null

		try {
			if (rawError !== null) {
				const decodedError = Buffer.from(rawError as string, "base64url").toString("utf8")
				parsedUnitError = JSON.parse(decodedError)
			}
		} catch (error) {
			// Ignore parse or decode errors
		} finally {
			if (parsedUnitError !== null) {
				const castParsedUnitError = parsedUnitError as UnitError
				request.documentProps = {
					"description": castParsedUnitError.detail,
					"title": castParsedUnitError.title
				}
			} else if (isUndefined(request.documentProps)) {
				// TODO: Remove in v0.15
				Log.errorMessage("middleware", `Document props must be provided in ${request.url}.`)
			}

			const url = request.originalUrl
			const pageContextInit = {
				"documentProps": request.documentProps,
				"pageProps": {
					...request.pageProps,
					parsedUnitError
				},
				"urlOriginal": url
			}
			const pageContext: Awaited<ReturnType<typeof renderPage>> & { errorStatus?: number }
			= await renderPage(pageContextInit)
			const { httpResponse, errorStatus } = pageContext
			if (httpResponse) {
				const { body, statusCode, contentType } = httpResponse
				response.status(errorStatus || statusCode).type(contentType).send(body)
			} else {
				next()
			}
		}
	})

	return router
}
