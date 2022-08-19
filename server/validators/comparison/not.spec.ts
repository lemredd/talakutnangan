import string from "!/validators/base/string"
import makeInitialState from "!/validators/make_initial_state"
import not from "./not"

describe("Validator pipe: not", () => {
	it("can accept valid input", async() => {
		const value = Promise.resolve(makeInitialState(3))
		const constraints = {
			"request": null,
			"source": null,
			"field": "hello",
			"not": {
				"pipes": [ string ]
			}
		}

		const sanitizeValue = (await not(value, constraints)).value

		expect(sanitizeValue).toStrictEqual(3)
	})

	it("cannot accept invalid input", () => {
		const value = Promise.resolve(makeInitialState("word"))
		const constraints = {
			"request": null,
			"source": null,
			"field": "hello",
			"not": {
				"pipes": [ string ]
			}
		}

		const error = not(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
	})
})
