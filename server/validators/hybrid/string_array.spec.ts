import makeInitialState from "!/validators/make_initial_state"
import stringArray from "./string_array"

describe("Validator pipe: stringArray", () => {
	it("can accept valid input", async () => {
		const value = Promise.resolve(makeInitialState("world,foo"))
		const constraints = {
			request: null,
			source: null,
			field: "hello",
			array: {
				pipes: [ jest.fn(value => value) ],
				constraints: {}
			}
		}

		const sanitizeValue = (await stringArray(value, constraints)).value

		expect(sanitizeValue).toEqual([ "world", "foo" ])
	})

	it("cannot accept invalid input", async () => {
		const value = Promise.resolve(makeInitialState(2))
		const constraints = {
			request: null,
			source: null,
			field: "hello",
			array: {
				pipes: [ jest.fn(value => value) ],
				constraints: {}
			}
		}

		const error = stringArray(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})
