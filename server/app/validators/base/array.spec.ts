import integer from "!/app/validators/base/integer"
import makeInitialState from "!/app/validators/make_initial_state"
import array from "./array"

describe("Validator pipe: array", () => {
	it("can accept valid input", async () => {
		const value = Promise.resolve(makeInitialState([ 2, 3 ]))
		const constraints = {
			request: null,
			field: "hello",
			array: {
				rules: {
					pipes: [ integer ],
					constraints: {}
				}
			}
		}

		const sanitizeValue = (await array(value, constraints)).value

		expect(sanitizeValue).toEqual([ 2, 3 ])
	})

	it("cannot accept few input", async () => {
		const value = Promise.resolve(makeInitialState([ 2 ]))
		const constraints = {
			request: null,
			field: "hello",
			array: {
				rules: {
					pipes: [ integer ],
					constraints: {}
				},
				minimum: 2
			}
		}

		const error = array(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
	})

	it("cannot accept greater input", async () => {
		const value = Promise.resolve(makeInitialState([ 2 ]))
		const constraints = {
			request: null,
			field: "hello",
			array: {
				rules: {
					pipes: [ integer ],
					constraints: {}
				},
				maximum: 0
			}
		}

		const error = array(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
	})

	it("cannot accept invalid input", async () => {
		const value = Promise.resolve(makeInitialState([ 2, "abc" ]))
		const constraints = {
			request: null,
			field: "hello",
			array: {
				rules: {
					pipes: [ integer ],
					constraints: {}
				}
			}
		}

		const error = array(value, constraints)

		expect(error).rejects.toHaveProperty("0.field", "hello.1")
	})
})
