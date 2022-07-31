import makeInitialState from "!/app/validators/make_initial_state"
import skipAsterisk from "./skip_asterisk"

describe("Validator pipe: skipAsterisk", () => {
	it("can skip asterisk", async () => {
		const value = Promise.resolve(makeInitialState("*"))
		const constraints = { request: null, source: null, field: "hello" }

		const maySkip = (await skipAsterisk(value, constraints)).maySkip

		expect(maySkip).toBeTruthy()
	})

	it("cannot accept invalid input", async () => {
		const value = Promise.resolve(makeInitialState("world"))
		const constraints = { request: null, source: null, field: "hello" }

		const maySkip = (await skipAsterisk(value, constraints)).maySkip

		expect(maySkip).toBeFalsy()
	})
})
