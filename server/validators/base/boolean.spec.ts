import makeInitialState from "!/validators/make_initial_state"
import boolean from "./boolean"

describe("Validator pipe: boolean", () => {
	it("can accept valid input", async() => {
		const value = Promise.resolve(makeInitialState(true))
		const constraints = { "request": null,
			"source": null,
			"field": "hello" }

		const sanitizeValue = (await boolean(value, constraints)).value

		expect(sanitizeValue).toEqual(true)
	})

	it("can accept valid loose input", async() => {
		const value = Promise.resolve(makeInitialState("1"))
		const constraints = {
			"request": null,
			"source": null,
			"field": "hello",
			"boolean": {
				"loose": true
			}
		}

		const sanitizeValue = (await boolean(value, constraints)).value

		expect(sanitizeValue).toEqual(true)
	})

	it("cannot accept invalid input", async() => {
		const value = Promise.resolve(makeInitialState("hello"))
		const constraints = { "request": null,
			"source": null,
			"field": "hello" }

		try {
			await boolean(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})
})
