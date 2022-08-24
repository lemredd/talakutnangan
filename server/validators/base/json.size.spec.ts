import makeInitialState from "!/validators/make_initial_state"
import jsonLength from "./json.size"

describe("Validator pipe: length", () => {
	it("can accept valid input", async() => {
		const obj = { "hello": "world" }
		const value = Promise.resolve(makeInitialState(obj))
		const constraints = {
			"request": null,
			"source": null,
			"field": "hello",
			"length": {
				"minimum": 17,
				"maximum": 17
			}
		}

		const sanitizeValue = (await jsonLength(value, constraints)).value

		expect(sanitizeValue).toEqual(obj)
	})

	it("cannot accept few input", () => {
		const obj = { "hello": "world" }
		const value = Promise.resolve(makeInitialState(obj))
		const constraints = {
			"request": null,
			"source": null,
			"field": "hello",
			"length": {
				"minimum": 18
			}
		}

		const error = jsonLength(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
	})

	it("cannot accept greater input", () => {
		const obj = { "hello": "world" }
		const value = Promise.resolve(makeInitialState(obj))
		const constraints = {
			"request": null,
			"source": null,
			"field": "hello",
			"length": {
				"maximum": 16
			}
		}

		const error = jsonLength(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
	})
})
