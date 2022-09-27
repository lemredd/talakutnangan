import integer from "!/validators/base/integer"
import makeInitialState from "!/validators/make_initial_state"
import validateExtensivelyIf from "./validate_extensively_if"

describe("Validator pipe: validate if", () => {
	it("can accept valid input", async() => {
		const value = Promise.resolve(makeInitialState(3))
		const constraints = {
			"field": "hello",
			"request": null,
			"source": null,
			"validateExtensivelyIf": {
				"condition": () => Promise.resolve(true),
				"rules": {
					"pipes": [ integer ]
				}
			}
		}

		const sanitizeValue = (await validateExtensivelyIf(value, constraints)).value

		expect(sanitizeValue).toStrictEqual(3)
	})

	it("can ignore if not for the current value", async() => {
		const value = Promise.resolve(makeInitialState("a"))
		const constraints = {
			"field": "hello",
			"request": null,
			"source": null,
			"validateExtensivelyIf": {
				"condition": () => Promise.resolve(false),
				"rules": {
					"pipes": [ integer ]
				}
			}
		}

		const sanitizeValue = (await validateExtensivelyIf(value, constraints)).value

		expect(sanitizeValue).toStrictEqual("a")
	})

	it("cannot accept invalid input", async() => {
		const value = Promise.resolve(makeInitialState("a"))
		const constraints = {
			"field": "hello",
			"request": null,
			"source": null,
			"validateExtensivelyIf": {
				"condition": () => Promise.resolve(true),
				"rules": {
					"pipes": [ integer ]
				}
			}
		}
		try {
			await validateExtensivelyIf(value, constraints)
		} catch (errors) {
			expect(errors).toHaveProperty("0.field", "hello")
		}
	})
})
