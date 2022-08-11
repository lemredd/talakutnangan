import makeInitialState from "!/validators/make_initial_state"
import integer from "./integer"

describe("Validator pipe: integer", () => {
	it("can accept valid input", async() => {
		const value = "2"
		const state = Promise.resolve(makeInitialState(value))
		const constraints = {
			"request": null,
			"source": null,
			"field": "hello"
		}

		const sanitizeValue = (await integer(state, constraints)).value

		expect(sanitizeValue).toEqual(value)
	})

	it("cannot accept invalid input", () => {
		const value = Promise.resolve(makeInitialState("hello"))
		const constraints = {
			"request": null,
			"source": null,
			"field": "hello"
		}

		const error = integer(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})
