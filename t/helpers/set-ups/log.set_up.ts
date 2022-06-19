import "dotenv/config"
import consola from "consola"

import Log from "!/helpers/log"

beforeAll(() => {
	consola.wrapAll()
	consola.mockTypes(() => jest.fn())
	Log.initialize()
})

beforeEach(() => {
	consola.mockTypes(() => jest.fn())
})
