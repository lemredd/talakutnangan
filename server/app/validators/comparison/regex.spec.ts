import makeInitialState from "!/app/validators/make_initial_state"
import regex from "./regex"

describe("Validator pipe: regex", () => {
	it("can accept valid input", async () => {
		const value = Promise.resolve(makeInitialState("world"))
		const constraints = { request: null, source: null, field: "hello", regex: { match: /world/ } }

		const sanitizeValue = (await regex(value, constraints)).value

		expect(sanitizeValue).toEqual("world")
	})

	it("cannot accept invalid input", async () => {
		const value = Promise.resolve(makeInitialState("foo"))
		const constraints = { request: null, source: null, field: "hello", regex: { match: /world/ } }

		const error = regex(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})
