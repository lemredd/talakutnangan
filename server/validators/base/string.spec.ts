import makeInitialState from "!/validators/make_initial_state"
import string from "./string"

describe("Validator pipe: string", () => {
	it("can accept valid input", async() => {
		const value = Promise.resolve(makeInitialState("world"))
		const constraints = { "request": null,
			"source": null,
			"field": "hello" }

		const sanitizeValue = (await string(value, constraints)).value

		expect(sanitizeValue).toEqual("world")
	})

	it("cannot accept invalid input", async() => {
		const value = Promise.resolve(makeInitialState(2))
		const constraints = { "request": null,
			"source": null,
			"field": "hello" }

		try {
			await string(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})
})
