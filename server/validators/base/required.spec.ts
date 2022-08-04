import makeInitialState from "!/validators/make_initial_state"
import required from "./required"

describe("Validator pipe: required", () => {
	it("can accept valid input", async () => {
		const value = Promise.resolve(makeInitialState("world"))
		const constraints = { request: null, source: null, field: "hello" }

		const sanitizeValue = (await required(value, constraints)).value

		expect(sanitizeValue).toEqual("world")
	})

	it("can accept boolean false", async () => {
		const value = Promise.resolve(makeInitialState(false))
		const constraints = { request: null, source: null, field: "hello" }

		const sanitizeValue = (await required(value, constraints)).value

		expect(sanitizeValue).toEqual(false)
	})

	it("cannot accept invalid null input", async () => {
		const value = Promise.resolve(makeInitialState(undefined))
		const constraints = { request: null, source: null, field: "hello" }

		const error = required(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})

	it("cannot accept invalid input", async () => {
		const value = Promise.resolve(makeInitialState(undefined))
		const constraints = { request: null, source: null, field: "hello" }

		const error = required(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})
