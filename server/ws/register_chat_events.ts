import Log from "$!/singletons/log"
import { Server } from "socket.io"

export default function(wsServer: Server) {
	wsServer.on("connection", socket => {
		socket.onAny((event, ...args) => {
			Log.debug("server", `Listening ${event} with ${JSON.stringify(args)}`)
		})

		Log.debug("server", "catch all handle")
	})

	function listenOnDynamicNamespace(namespace: RegExp, logMessage: string) {
		wsServer.of(namespace).on("connection", () => {
			Log.debug("server", logMessage)
		})
	}

	listenOnDynamicNamespace(
		/^\/consultation\/\d+\/chat$/u,
		"listening for chat"
	)
	listenOnDynamicNamespace(
		/^\/consultation\/\d+\/self$/u,
		"listening for consultation in self"
	)
	listenOnDynamicNamespace(
		/^\/consultation\/\d+\/chat_activity$/u,
		"listening for consultation chat activity"
	)
}
