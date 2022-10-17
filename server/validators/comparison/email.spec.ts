import makeInitialState from "!/validators/make_initial_state"
import email from "./email"

describe("Validator pipe: email", () => {
	it("can accept valid input", async() => {
		const value = Promise.resolve(makeInitialState("admin@examle.com"))
		const constraints = {
			"request": null,
			"source": null,
			"field": "hello"
		}

		const sanitizeValue = (await email(value, constraints)).value

		expect(sanitizeValue).toEqual("admin@examle.com")
	})

	it("cannot accept invalid input", async() => {
		const value = Promise.resolve(makeInitialState("admin.examle.com"))
		const constraints = {
			"request": null,
			"source": null,
			"field": "hello"
		}

		try {
			await email(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})
})
