import { Server as HTTPServer } from "http"

import { SourceType } from "$/types/database"

import Router from "!%/router"
import Peer from "!/peer/peer"
import Socket from "!/ws/socket"
import Log from "$!/singletons/log"
import URLMaker from "$!/singletons/url_maker"
import createWSServer from "!/ws/create_server"
import createAppHandler from "!/app/create_handler"
import createPeerServer from "!/peer/create_server_middleware"
import RequestEnvironment from "$/singletons/request_environment"
import initializeSingletons from "!/helpers/initialize_singletons"

export default async function startServer(): Promise<HTTPServer> {
	await initializeSingletons(
		RequestEnvironment.isOnTest
			? process.env.DATABASE_TEST_TYPE as SourceType
			: process.env.DATABASE_TYPE as SourceType
	)

	const customRouter = new Router()

	const app = await createAppHandler(customRouter)
	const httpServer = new HTTPServer(app)
	const wsServer = createWSServer(httpServer)
	const peerServer = createPeerServer(app, httpServer)

	Socket.initialize(wsServer)
	Peer.initialize(peerServer)

	const port = process.env.PORT || 3000
	httpServer.listen(port)
	Log.success("server", `HTTP server running at ${URLMaker.makeBaseURL()}`)

	return httpServer
}
