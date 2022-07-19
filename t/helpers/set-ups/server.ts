import "reflect-metadata"
import "dotenv/config"

import startServer from "!/start_server"

beforeAll(async () => {
	await startServer()
})
