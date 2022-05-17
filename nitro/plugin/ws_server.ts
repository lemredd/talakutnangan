import { Server as HTTPServer } from "http"
import { Server as HTTPSServer } from "https"
import createWSServer from "~/nitro/ws_server/create"
import registerWSEvents from "~/nitro/ws_server/register_events"

// Inspired from https://github.com/unjs/nitro/blob/89784044de3c5d7b518225488684f0b391a372be/src/runtime/entries/node-server.ts
export default defineNitroPlugin(nitroApp => {
	console.log("Environment: ", process.env.NODE_ENV)
	if (process.env.NODE_ENV === "development") {
		return;
	}

	const handler = nitroApp.h3App.nodeHandler
	const configuration = useRuntimeConfig()
	const cert = configuration.server.cert
	const key = configuration.server.key
	const hostname = configuration.server.host
	const port = configuration.server.port

	const httpServer = configuration.server.isSecure
		? new HTTPSServer({ key, cert }, handler)
		: new HTTPServer(handler)

	const wsServer = createWSServer(httpServer)
	registerWSEvents(wsServer)

	// @ts-ignore
	httpServer.listen(port, (error) => {
		if (error) {
			console.error(error)
			process.exit(1)
		}

		console.log(`Listening on ${configuration.server.baseURI}`)

		const WSVersion = configuration.server.isSecure ? "wss" : "ws"
		console.log(`Listening on ${WSVersion}://${hostname}:${port}${configuration.server.baseURL}`)
	})

	process.on(
		"unhandledRejection",
		err => console.error("[nitro plugin] [unhandledRejection] " + err)
	)
	process.on(
		"uncaughtException",
		err => console.error("[nitro plugin] [uncaughtException] " + err)
	)
})
