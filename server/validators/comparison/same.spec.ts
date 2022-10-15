import makeInitialState from "!/validators/make_initial_state"
import same from "./same"

describe("Validator pipe: same", () => {
	it("can accept valid input", async() => {
		const value = Promise.resolve(makeInitialState("world"))
		const constraints = {
			"field": "hello",
			"request": null,
			"same": {
				"value": "world"
			},
			"source": null
		}

		const sanitizeValue = (await same(value, constraints)).value

		expect(sanitizeValue).toEqual("world")
	})

	it("cannot accept invalid input", () => {
		const value = Promise.resolve(makeInitialState("foo"))
		const constraints = {
			"field": "hello",
			"request": null,
			"same": {
				"value": "world"
			},
			"source": null
		}

		try {
			await same(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})
})
