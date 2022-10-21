import makeInitialState from "!/validators/make_initial_state"
import regex from "./regex"

describe("Validator pipe: regex", () => {
	it("can accept valid input", async() => {
		const value = Promise.resolve(makeInitialState("world"))
		const constraints = { "request": null,
			"source": null,
			"field": "hello",
			"regex": { "match": /world/ } }

		const sanitizeValue = (await regex(value, constraints)).value

		expect(sanitizeValue).toEqual("world")
	})

	it("can accept valid input with whitespace", async() => {
		const value = Promise.resolve(makeInitialState("Regional Functionality Executive"))
		const constraints = {
			"field": "hello",
			"regex": {
				"friendlyDescription": "",
				"match": /^([A-Z][a-z-_]+ )*[A-Z][a-z-_]+$/u
			},
			"request": null,
			"source": null
		}

		const sanitizeValue = (await regex(value, constraints)).value

		expect(sanitizeValue).toEqual("Regional Functionality Executive")
	})

	it("cannot accept invalid input", async() => {
		const value = Promise.resolve(makeInitialState("foo"))
		const constraints = {
			"field": "hello",
			"regex": {
				"friendlyDescription": "",
				"match": /world/u
			},
			"request": null,
			"source": null
		}
		try {
			await regex(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})
})
