import { Server } from "http"
import { Server as WebSocketServer } from "socket.io"

import Log from "!/helpers/log"
import registerChatEvents from "!/ws/register_chat_events"

export default function(httpServer: Server) {
	const wsServer = new WebSocketServer(httpServer)

	Log.success("Server", "Initialized web socket server")

	registerChatEvents(wsServer)

	return wsServer
}
