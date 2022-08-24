import makeInitialState from "!/validators/make_initial_state"
import anyObject from "./any_object"

describe("Validator pipe: any object", () => {
	it("can accept valid input", async() => {
		const value = Promise.resolve(makeInitialState({
			"foo": "bar",
			"hello": "world"
		}))
		const constraints = {
			"field": "hello",
			"request": null,
			"source": null
		}

		const sanitizeValue = (await anyObject(value, constraints)).value

		expect(sanitizeValue).toStrictEqual({
			"foo": "bar",
			"hello": "world"
		})
	})

	it("cannot accept invalid input", () => {
		const value = Promise.resolve(makeInitialState("world"))
		const constraints = {
			"field": "hello",
			"request": null,
			"source": null
		}

		const error = anyObject(value, constraints)

		expect(error).rejects.toHaveProperty("field")
	})
})
