import makeInitialState from "!/validators/make_initial_state"
import stringArray from "./string_array"

describe("Validator pipe: string array", () => {
	it("can accept valid input", async() => {
		const value = Promise.resolve(makeInitialState("world,foo"))
		const constraints = {
			"array": {
				"constraints": {},
				"pipes": [ jest.fn(pipedValue => pipedValue) ]
			},
			"field": "hello",
			"request": null,
			"source": null
		}

		const sanitizeValue = (await stringArray(value, constraints)).value

		expect(sanitizeValue).toEqual([ "world", "foo" ])
	})

	it("cannot accept invalid input", async() => {
		const value = Promise.resolve(makeInitialState(2))
		const constraints = {
			"array": {
				"constraints": {},
				"pipes": [ jest.fn(pipedValue => pipedValue) ]
			},
			"field": "hello",
			"request": null,
			"source": null
		}

		try {
			await stringArray(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})
})
