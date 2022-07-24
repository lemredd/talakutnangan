import makeInitialState from "!/app/validators/make_initial_state"
import required from "./required"

describe("Validator pipe: required", () => {
	it("can accept valid input", async () => {
		const value = Promise.resolve(makeInitialState("world"))
		const constraints = { request: null, field: "hello" }

		const sanitizeValue = await required(value, constraints)

		expect(sanitizeValue).toEqual("world")
	})

	it("cannot accept invalid input", async () => {
		const value = Promise.resolve(makeInitialState(undefined))
		const constraints = { request: null, field: "hello" }

		const error = required(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})
