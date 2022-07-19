import { Server as HTTPServer } from "node:http"

import { SourceType } from "$/types/database"

import Log from "$!/singletons/log"
import Router from "!/app/routes/router"
import URLMaker from "$!/singletons/url_maker"
import createWSServer from "!/ws/create_server"
import createAppHandler from "!/app/create_handler"
import initializeSingletons from "!/helpers/initialize_singletons"

export default async function startServer() {
	await initializeSingletons(process.env.DATABASE_TYPE as SourceType)

	const customRouter = new Router()

	const app = await createAppHandler(customRouter)
	const httpServer = new HTTPServer(app)
	const _wsServer = createWSServer(httpServer)

	const port = process.env.PORT || 3000
	httpServer.listen(port)
	Log.success("server", `HTTP server running at ${URLMaker.makeBaseURL()}`)
}
