import "reflect-metadata"
import "dotenv/config"
import { Server as HTTPServer } from "http"
import { DataSource } from "typeorm"
import express from "express"
import compression from "compression"
import { createPageRenderer } from "vite-plugin-ssr"
import render from "!/render"
import createWSServer from "!/ws_server/create"
import registerWSEvents from "!/ws_server/register_events"
import manageRoutes from "!/routes/manage_routes"
import User from "!/model/user"

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

	const dataSource = new DataSource({
		type: "mysql",
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT as number,
		database: process.env.DATABASE_NAME,
		username: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASS,
		entities: [
			User
		],
		synchronize: true,
		logging: true
	})

	await dataSource.initialize()

	const manager = dataSource.manager

	const renderPage = createPageRenderer({ viteDevServer, isProduction, root })
	app.use(manageRoutes())
	app.get("*", (request, response, next) => render(renderPage, request, response, next))

	const port = process.env.PORT || 3000
	const httpServer = new HTTPServer(app)
	const wsServer = createWSServer(httpServer)

	registerWSEvents(wsServer)
	httpServer.listen(port)
	console.log(`Server running at http://localhost:${port}`)
}
