import makeInitialState from "!/validators/make_initial_state"
import date from "!/validators/base/date"

describe("Validator pipe: date", () => {
	it("can accept valid input", async() => {
		const value = "1995-12-17T03:23:00"
		const state = Promise.resolve(makeInitialState(value))
		const constraints = {
			"field": "hello",
			"request": null,
			"source": null
		}
		const sanitizeValue = (await date(state, constraints)).value

		expect(sanitizeValue).toEqual(new Date(value))
	})

	it("cannot accept invalid input", async() => {
		const value = Promise.resolve(makeInitialState("hello"))
		const constraints = {
			"field": "hello",
			"request": null,
			"source": null
		}

		try {
			await date(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})
})
