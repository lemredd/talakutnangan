import makeInitialState from "!/validators/make_initial_state"
import JSONSize from "./json_size"

describe("Validator pipe: JSON Size", () => {
	it("can accept valid input", async() => {
		const obj = { "hello": "world" }
		const value = Promise.resolve(makeInitialState(obj))
		const constraints = {
			"request": null,
			"source": null,
			"field": "hello",
			"size": {
				"minimum": 17,
				"maximum": 17
			}
		}

		const sanitizeValue = (await JSONSize(value, constraints)).value

		expect(sanitizeValue).toEqual(obj)
	})

	it("cannot accept few input", () => {
		const obj = { "hello": "world" }
		const value = Promise.resolve(makeInitialState(obj))
		const constraints = {
			"request": null,
			"source": null,
			"field": "hello",
			"size": {
				"minimum": 18
			}
		}

		const error = JSONSize(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
	})

	it("cannot accept greater input", () => {
		const obj = { "hello": "world" }
		const value = Promise.resolve(makeInitialState(obj))
		const constraints = {
			"request": null,
			"source": null,
			"field": "hello",
			"size": {
				"maximum": 16
			}
		}

		const error = JSONSize(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
	})
})
