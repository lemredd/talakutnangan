import { Server as WebSocketServer } from "socket.io"

export default function(httpServer) {
	const wsServer = new WebSocketServer(httpServer)

	global.wsServer = wsServer

	console.log("Initialized web socket server")

	return wsServer
}
