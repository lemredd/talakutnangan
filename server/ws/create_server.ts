import { Server } from "http"
import { Server as WebSocketServer } from "socket.io"

import registerChatEvents from "!/ws/register_chat_events"
import registerGlobalMiddlewares from "!/ws/register_global_middlewares"

export default function(httpServer: Server): WebSocketServer {
	const wsServer = new WebSocketServer(httpServer)

	registerGlobalMiddlewares(wsServer)
	registerChatEvents(wsServer)

	return wsServer
}
