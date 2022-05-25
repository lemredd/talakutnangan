import RequestEnvironment from "./request_environment"

import Database from "~/database"

describe("Back-end: Request Environment", () => {
	it("cannot get entity manager without initialization", () => {
		expect(() => RequestEnvironment.current.manager).toThrow()
	})

	it("can get entity manager after initialization", () => {
		RequestEnvironment.intialize(Database.manager)

		expect(RequestEnvironment.current.manager).toEqual(Database.manager)
	})
})
