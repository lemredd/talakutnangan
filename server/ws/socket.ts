import { Server as WebSocketServer } from "socket.io"

import Log from "$!/singletons/log"
import RequestEnvironment from "$!/singletons/request_environment"

export default class Socket extends RequestEnvironment {
	private static server: WebSocketServer|null = null

	static initialize(server: WebSocketServer) {
		Socket.server = server

		Log.trace("app", "initialized web socket")
	}
}
