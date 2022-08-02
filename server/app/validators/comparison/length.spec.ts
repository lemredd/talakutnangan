import integer from "!/app/validators/base/integer"
import makeInitialState from "!/app/validators/make_initial_state"
import length from "./length"

describe("Validator pipe: length", () => {
	it("can accept valid input", async () => {
		const value = Promise.resolve(makeInitialState([ 2, 3 ]))
		const constraints = {
			request: null,
			source: null,
			field: "hello",
			length: {
				minimimum: 2,
				maximimum: 2
			}
		}

		const sanitizeValue = (await length(value, constraints)).value

		expect(sanitizeValue).toEqual([ 2, 3 ])
	})

	it("cannot accept few input", async () => {
		const value = Promise.resolve(makeInitialState([ 2 ]))
		const constraints = {
			request: null,
			source: null,
			field: "hello",
			length: {
				minimum: 2
			}
		}

		const error = length(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
	})

	it("cannot accept greater input", async () => {
		const value = Promise.resolve(makeInitialState([ 2 ]))
		const constraints = {
			request: null,
			source: null,
			field: "hello",
			length: {
				maximum: 0
			}
		}

		const error = length(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
	})
})
