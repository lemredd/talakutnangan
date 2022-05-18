import express from "express"
import compression from "compression"
import { createPageRenderer } from "vite-plugin-ssr"
import type { renderPage } from "vite-plugin-ssr/dist/cjs/node/renderPage"
import type { Request, Response, NextFunction } from "express"

const isProduction = process.env.NODE_ENV === "production"
const root = `${__dirname}/..`

startServer()

async function startServer() {
	const app = express()

	app.use(compression())

	let viteDevServer
	if (isProduction) {
		app.use(express.static(`${root}/dist/client`))
	} else {
		const vite = require("vite")
		viteDevServer = await vite.createServer({
			root,
			server: { middlewareMode: "ssr" },
		})
		app.use(viteDevServer.middlewares)
	}

	const renderPage = createPageRenderer({ viteDevServer, isProduction, root })
	app.get("*", (request, response, next) => render(renderPage, request, response, next))

	const port = process.env.PORT || 3000
	app.listen(port)
	console.log(`Server running at http://localhost:${port}`)
}

type RenderPage = typeof renderPage

async function render(
	renderPage: RenderPage,
	request: Request,
	response: Response,
	next: NextFunction
) {
	const url = request.originalUrl
	const pageContextInit = {
		url,
	}
	const pageContext = await renderPage(pageContextInit)
	const { httpResponse } = pageContext
	if (!httpResponse) return next()
	const { body, statusCode, contentType } = httpResponse
	response.status(statusCode).type(contentType).send(body)
}
