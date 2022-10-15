import makeInitialState from "!/validators/make_initial_state"
import stringArray from "./string_array"

describe("Validator pipe: string array", () => {
	it("can accept valid input", async() => {
		const value = Promise.resolve(makeInitialState("world,foo"))
		const constraints = {
			"request": null,
			"source": null,
			"field": "hello",
			"array": {
				"pipes": [ jest.fn(pipedValue => pipedValue) ],
				"constraints": {}
			}
		}

		const sanitizeValue = (await stringArray(value, constraints)).value

		expect(sanitizeValue).toEqual([ "world", "foo" ])
	})

	it("cannot accept invalid input", () => {
		const value = Promise.resolve(makeInitialState(2))
		const constraints = {
			"request": null,
			"source": null,
			"field": "hello",
			"array": {
				"pipes": [ jest.fn(pipedValue => pipedValue) ],
				"constraints": {}
			}
		}

		try {
			await stringArray(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})
})
