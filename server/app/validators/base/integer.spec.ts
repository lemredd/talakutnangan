import makeInitialState from "!/app/validators/make_initial_state"
import integer from "./integer"

describe("Validator pipe: integer", () => {
	it("can accept valid input", async () => {
		const value = Promise.resolve(makeInitialState(2))
		const constraints = { request: null, source: null, field: "hello" }

		const sanitizeValue = (await integer(value, constraints)).value

		expect(sanitizeValue).toEqual(2)
	})

	it("cannot accept invalid input", async () => {
		const value = Promise.resolve(makeInitialState("hello"))
		const constraints = { request: null, source: null, field: "hello" }

		const error = integer(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})
