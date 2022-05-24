import { Server } from "http"
import { Server as WebSocketServer } from "socket.io"
import registerChatEvents from "./register_chat_events"

export default function(httpServer: Server) {
	const wsServer = new WebSocketServer(httpServer)

	console.log("Initialized web socket server")

	registerChatEvents(wsServer)

	return wsServer
}
