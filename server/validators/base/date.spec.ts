import makeInitialState from "!/validators/make_initial_state"
import date from "!/validators/base/date"

describe("Validator pipe: date", () => {
	it("can accept valid input", async() => {
		const value = "1995-12-17T03:23:00"
		const state = Promise.resolve(makeInitialState(value))
		const sanitizeValue = (await date(state)).value

		expect(sanitizeValue).toEqual(new Date(value))
	})

	it("cannot accept invalid input", () => {
		const value = Promise.resolve(makeInitialState("hello"))

		const error = date(value)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})
