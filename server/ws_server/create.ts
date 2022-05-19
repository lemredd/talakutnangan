import { Server } from "http"
import { Server as WebSocketServer } from "socket.io"

export default function(httpServer: Server) {
	const wsServer = new WebSocketServer(httpServer)

	console.log("Initialized web socket server")

	return wsServer
}
