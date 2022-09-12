import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import makeInitialState from "!/validators/make_initial_state"
import or from "./or"

describe("Validator pipe: or", () => {
	it("can accept valid input", async() => {
		const value = Promise.resolve(makeInitialState(3))
		const constraints = {
			"field": "hello",
			"or": {
				"rules": [
					{
						"pipes": [ string ]
					},
					{
						"pipes": [ integer ]
					}
				]
			},
			"request": null,
			"source": null
		}

		const sanitizeValue = (await or(value, constraints)).value

		expect(sanitizeValue).toStrictEqual(3)
	})

	it("cannot accept invalid input", () => {
		const value = Promise.resolve(makeInitialState([]))
		const constraints = {
			"field": "hello",
			"or": {
				"rules": [
					{
						"pipes": [ string ]
					},
					{
						"pipes": [ integer ]
					}
				]
			},
			"request": null,
			"source": null
		}

		const error = or(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
	})
})
