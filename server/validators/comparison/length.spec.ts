import makeInitialState from "!/validators/make_initial_state"
import length from "./length"

describe("Validator pipe: length", () => {
	it("can accept valid input", async() => {
		const value = Promise.resolve(makeInitialState([ 2, 3 ]))
		const constraints = {
			"field": "hello",
			"length": {
				"maximum": 2,
				"minimum": 2
			},
			"request": null,
			"source": null
		}

		const sanitizeValue = (await length(value, constraints)).value

		expect(sanitizeValue).toEqual([ 2, 3 ])
	})

	it("cannot accept few input", () => {
		const value = Promise.resolve(makeInitialState([ 2 ]))
		const constraints = {
			"field": "hello",
			"length": {
				"minimum": 2
			},
			"request": null,
			"source": null
		}

		const error = length(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
	})

	it("cannot accept greater input", () => {
		const value = Promise.resolve(makeInitialState([ 2 ]))
		const constraints = {
			"field": "hello",
			"length": {
				"maximum": 0
			},
			"request": null,
			"source": null
		}

		const error = length(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
	})
})
