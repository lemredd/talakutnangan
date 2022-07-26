import makeInitialState from "!/app/validators/make_initial_state"
import boolean from "./boolean"

describe("Validator pipe: boolean", () => {
	it("can accept valid input", async () => {
		const value = Promise.resolve(makeInitialState("1"))
		const constraints = { request: null, source: null, field: "hello" }

		const sanitizeValue = (await boolean(value, constraints)).value

		expect(sanitizeValue).toEqual(true)
	})

	it("cannot accept invalid input", async () => {
		const value = Promise.resolve(makeInitialState("hello"))
		const constraints = { request: null, source: null, field: "hello" }

		const error = boolean(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})
