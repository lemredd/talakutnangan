import RequestEnvironment from "./request_environment"

import Database from "~/database"

describe("Back-end: Request Environment", () => {
	// Skip because request environment is already initialize in set up
	it.skip("can get entity manager without initialization", () => {
		expect(() => RequestEnvironment.current.manager).toThrow()
	})

	it("can get entity manager after initialization", () => {
		expect(RequestEnvironment.current.manager).toEqual(Database.manager)
	})
})
