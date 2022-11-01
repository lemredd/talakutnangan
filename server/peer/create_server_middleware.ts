import type { Server } from "http"
import type { Express } from "express"
import type { PeerServer } from "!/types/dependent"

import { PEER_SERVER_PATH_PREFIX, PEER_SERVER_SUBPATH } from "$/constants/template_links"

import { ExpressPeerServer } from "peer"

export default function(app: Express, httpServer: Server): PeerServer {
	const peerServer = ExpressPeerServer(httpServer, {
		"path": PEER_SERVER_SUBPATH,
		"proxied": process.env.WEB_PROXY === "true"
	})

	app.use(PEER_SERVER_PATH_PREFIX, peerServer)

	return peerServer
}
