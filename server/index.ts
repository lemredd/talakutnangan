import { Server as HTTPServer } from "http"
import express from "express"
import compression from "compression"
import { createPageRenderer } from "vite-plugin-ssr"
import render from "!/render"
import createWSServer from "!/ws_server/create"
import registerWSEvents from "!/ws_server/register_events"

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
	const httpServer = new HTTPServer(app)
	const wsServer = createWSServer(httpServer)

	registerWSEvents(wsServer)
	httpServer.listen(port)
	console.log(`Server running at http://localhost:${port}`)
}
