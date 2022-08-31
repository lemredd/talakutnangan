import type { Server } from "http"
import type { Express } from "express"

import { ExpressPeerServer } from "peer"

export default function(httpServer: Server): Express {
	const peerServer = ExpressPeerServer(httpServer, {
		"path": "/",
		"proxied": process.env.WEB_PROXY === "true"
	})

	return peerServer
}
