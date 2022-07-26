import makeInitialState from "!/app/validators/make_initial_state"
import oneOf from "./one-of"

describe("Validator pipe: one-of", () => {
	it("can accept valid input", async () => {
		const value = Promise.resolve(makeInitialState("world"))
		const constraints = {
			request: null,
			source: null,
			field: "hello",
			oneOf: {
				values: [ "foo", "bar", "world" ]
			}
		}

		const sanitizeValue = (await oneOf(value, constraints)).value

		expect(sanitizeValue).toEqual("world")
	})

	it("cannot accept invalid input", async () => {
		const value = Promise.resolve(makeInitialState("baz"))
		const constraints = {
			request: null,
			source: null,
			field: "hello",
			oneOf: {
				values: [ "foo", "bar", "world" ]
			}
		}

		const error = oneOf(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})
