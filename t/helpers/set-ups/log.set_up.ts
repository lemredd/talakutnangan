import "dotenv/config"
import consola from "consola"

import Log from "!/helpers/log"

beforeAll(() => {
	consola.wrapAll()
	consola.mockTypes(() => () => {})
	Log.initialize()
})
