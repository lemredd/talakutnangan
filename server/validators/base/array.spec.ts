import integer from "!/validators/base/integer"
import makeInitialState from "!/validators/make_initial_state"
import array from "./array"

describe("Validator pipe: array", () => {
	it("can accept valid input", async () => {
		const value = Promise.resolve(makeInitialState([ 2, 3 ]))
		const constraints = {
			request: null,
			source: null,
			field: "hello",
			array: {
				pipes: [ integer ],
				constraints: {}
			}
		}

		const sanitizeValue = (await array(value, constraints)).value

		expect(sanitizeValue).toEqual([ 2, 3 ])
	})

	it("can pass original source", async () => {
		const value = Promise.resolve(makeInitialState([ 4, 5, 6 ]))
		const source = Symbol("source")
		const customPipe = jest.fn(value => value)
		const constraints = {
			request: null,
			source,
			field: "hello",
			array: {
				pipes: [ customPipe ],
				constraints: {}
			}
		}

		await array(value, constraints)

		expect(customPipe).toHaveBeenCalled()
		expect(customPipe.mock.calls[0]).toHaveProperty("1.source", source)
	})

	it("cannot accept invalid input", async () => {
		const value = Promise.resolve(makeInitialState([ 2, "abc" ]))
		const constraints = {
			request: null,
			source: null,
			field: "hello",
			array: {
				pipes: [ integer ],
				constraints: {}
			}
		}

		const error = array(value, constraints)

		expect(error).rejects.toHaveProperty("0.field", "hello.1")
	})
})
