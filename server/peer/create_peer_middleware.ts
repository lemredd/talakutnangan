import type { Server } from "http"
import type { PeerServer } from "!/types/dependent"

import { ExpressPeerServer } from "peer"

export default function(httpServer: Server): PeerServer {
	const peerServer = ExpressPeerServer(httpServer, {
		"path": "/",
		"proxied": process.env.WEB_PROXY === "true"
	})

	return peerServer
}
