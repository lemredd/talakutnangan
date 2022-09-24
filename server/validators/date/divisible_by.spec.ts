import makeInitialState from "!/validators/make_initial_state"
import divisibleBy from "./divisible_by"

describe("Validator pipe: divisible by", () => {
	it("can accept valid input", async() => {
		const value = Promise.resolve(makeInitialState("10"))
		const constraints = {
			"request": null,
			"source": null,
			"field": "hello",
			"divisibleBy": {
				"value": 2
			}
		}

		const sanitizeValue = (await divisibleBy(value, constraints)).value

		expect(sanitizeValue).toEqual("10")
	})

	it("can accept invalid input", () => {
		const value = Promise.resolve(makeInitialState("10"))
		const constraints = {
			"request": null,
			"source": null,
			"field": "hello",
			"divisibleBy": {
				"value": 9
			}
		}

		const error = divisibleBy(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})
