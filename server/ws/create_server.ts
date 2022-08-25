import { Server } from "http"
import { Server as WebSocketServer } from "socket.io"

import Log from "$!/singletons/log"
import registerChatEvents from "!/ws/register_chat_events"

export default function(httpServer: Server): WebSocketServer {
	const wsServer = new WebSocketServer(httpServer)

	Log.success("server", "Initialized web socket server")

	registerChatEvents(wsServer)

	return wsServer
}
