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
import initializeDependent from "!/helpers/initializers/dependent"
import initializeIndependent from "!/helpers/initializers/independent"

export default async function startServer(): Promise<HTTPServer> {
	Log.initialize()

	Log.trace("app", "initialized logger")

	const independentInitializationProcess = initializeIndependent()

	const dependentInitializationProcess = initializeDependent(
		RequestEnvironment.isOnTest
			? process.env.DATABASE_TEST_TYPE as SourceType
			: process.env.DATABASE_TYPE as SourceType
	)

	const customRouter = new Router()

	const [ app ] = await Promise.all([
		independentInitializationProcess.then(() => createAppHandler(customRouter)),
		dependentInitializationProcess
	])

	const httpServer = new HTTPServer(app)

	if (process.env.WEB_SOCKET_SERVER !== "false") {
		const wsServer = createWSServer(httpServer)
		Socket.initialize(wsServer)
	}

	if (process.env.WEB_PEER_SERVER !== "false") {
		const peerServer = createPeerServer(app, httpServer)
		Peer.initialize(peerServer)
	}

	const port = Number(process.env.PORT || "3000")
	httpServer.listen(port)
	Log.success("server", `HTTP server running at ${URLMaker.makeBaseURL()}`)

	return httpServer
}
