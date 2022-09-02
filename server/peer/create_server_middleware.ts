import type { Server } from "http"
import type { Express } from "express"
import type { PeerServer } from "!/types/dependent"

import { ExpressPeerServer } from "peer"

export default function(app: Express, httpServer: Server): PeerServer {
	const peerServer = ExpressPeerServer(httpServer, {
		"path": "/server",
		"proxied": process.env.WEB_PROXY === "true"
	})

	app.use("/p2p", peerServer)

	return peerServer
}
