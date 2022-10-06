import Log from "$!/singletons/log"
import { Server } from "socket.io"

export default function(wsServer: Server) {
	const messages: string[] = []

	wsServer.on("connection", (socket) => {
		socket.onAny((event, ...args) => {
			Log.debug("server", `Listening ${event} with ${JSON.stringify(args)}`)
		})

		Log.debug("server", "catch all handle")
	})
}
