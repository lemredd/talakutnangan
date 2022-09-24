import "reflect-metadata"
import "dotenv/config"
import { Server as HTTPServer } from "http"

import startServer from "!/start_server"

let server: HTTPServer|null = null

beforeAll(async() => {
	server = await startServer()
})

beforeAll(() => {
	if (server !== null) {
		server.close()
	}
})
