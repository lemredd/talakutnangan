import { Server } from "http"
import { Server as WebSocketServer } from "socket.io"

import registerChatEvents from "!/ws/register_chat_events"

export default function(httpServer: Server): WebSocketServer {
	const wsServer = new WebSocketServer(httpServer)

	registerChatEvents(wsServer)

	return wsServer
}
