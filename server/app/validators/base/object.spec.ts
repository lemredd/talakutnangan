import string from "!/app/validators/base/string"
import makeInitialState from "!/app/validators/make_initial_state"
import object from "./object"

describe("Validator pipe: object", () => {
	it("can accept valid input", async () => {
		const value = Promise.resolve(makeInitialState({ hello: "world", foo: "bar" }))
		const constraints = {
			request: null,
			source: null,
			field: "hello",
			object: {
				hello: {
					pipes: [ string ],
					constraints: {}
				},
				foo: {
					pipes: [ string ],
					constraints: {}
				}
			}
		}

		const sanitizeValue = (await object(value, constraints)).value

		expect(sanitizeValue).toStrictEqual({ hello: "world", foo: "bar" })
	})

	it("cannot accept invalid input", async () => {
		const value = Promise.resolve(makeInitialState({ hello: 2, foo: 2 }))
		const constraints = {
			request: null,
			source: null,
			field: "hi",
			object: {
				hello: {
					pipes: [ string ],
					constraints: {}
				},
				foo: {
					pipes: [ string ],
					constraints: {}
				}
			}
		}

		const error = object(value, constraints)

		expect(error).rejects.toHaveLength(2)
		expect(error).rejects.toHaveProperty("0.field", "hi.hello")
		expect(error).rejects.toHaveProperty("1.field", "hi.foo")
	})
})
