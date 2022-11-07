import makeInitialState from "!/validators/make_initial_state"
import email from "./email"

describe("Validator pipe: email", () => {
	it("can accept valid input", async() => {
		const value = Promise.resolve(makeInitialState("admin.head@example.com"))
		const constraints = {
			"field": "hello",
			"request": null,
			"source": null
		}

		const sanitizeValue = (await email(value, constraints)).value

		expect(sanitizeValue).toEqual("admin.head@example.com")
	})

	it("cannot accept short email username", async() => {
		const value = Promise.resolve(makeInitialState("admin@example.com"))
		const constraints = {
			"field": "hello",
			"request": null,
			"source": null
		}

		try {
			await email(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})

	it("cannot accept invalid input", async() => {
		const value = Promise.resolve(makeInitialState("admin.example.com"))
		const constraints = {
			"field": "hello",
			"request": null,
			"source": null
		}

		try {
			await email(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})
})
