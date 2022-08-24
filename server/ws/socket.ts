import { Server as WebSocketServer } from "socket.io"

import Log from "$!/singletons/log"
import Developer from "$!/errors/developer"
import RequestEnvironment from "$!/singletons/request_environment"

export default class Socket extends RequestEnvironment {
	private static rawServer: WebSocketServer|null = null

	static initialize(server: WebSocketServer) {
		this.rawServer = server

		Log.trace("app", "initialized web socket")
	}

	static emitToClients(namespace: string, eventName: string, ...data: any): void {
		this.server.of(namespace).emit(eventName, data)
	}

	private static get server(): WebSocketServer {
		if (this.rawServer) return this.rawServer

		throw new Developer(
			"Web socket server was not initialized.",
			"Some services are not working at the moment."
		)
	}
}
