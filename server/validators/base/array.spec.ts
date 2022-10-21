import integer from "!/validators/base/integer"
import makeInitialState from "!/validators/make_initial_state"
import array from "./array"

describe("Validator pipe: array", () => {
	it("can accept valid input", async() => {
		const value = Promise.resolve(makeInitialState([ 2, 3 ]))
		const constraints = {
			"array": {
				"constraints": {},
				"pipes": [ integer ]
			},
			"field": "hello",
			"request": null,
			"source": null
		}

		const sanitizeValue = (await array(value, constraints)).value

		expect(sanitizeValue).toEqual([ 2, 3 ])
	})

	it("can pass original source", async() => {
		const value = Promise.resolve(makeInitialState([ 4, 5, 6 ]))
		const source = Symbol("source")
		const customPipe = jest.fn(originalValue => originalValue)
		const constraints = {
			"array": {
				"constraints": {},
				"pipes": [ customPipe ]
			},
			"field": "hello",
			"request": null,
			source
		}

		await array(value, constraints)

		expect(customPipe).toHaveBeenCalled()
		expect(customPipe.mock.calls[0]).toHaveProperty("1.source", source)
	})

	it("cannot accept invalid input with friendly names", async() => {
		const value = Promise.resolve(makeInitialState([ 2, "abc" ]))
		const friendlyName = "def"
		const constraints = {
			"array": {
				"constraints": {},
				friendlyName,
				"pipes": [ integer ]
			},
			"field": "hello",
			"request": null,
			"source": null
		}

		try {
			await array(value, constraints)
		} catch (errors) {
			expect(errors).toHaveProperty("0.friendlyName", friendlyName)
		}
	})

	it("cannot accept invalid input", async() => {
		const value = Promise.resolve(makeInitialState([ 2, "abc" ]))
		const constraints = {
			"array": {
				"constraints": {},
				"pipes": [ integer ]
			},
			"field": "hello",
			"request": null,
			"source": null
		}

		try {
			await array(value, constraints)
		} catch (errors) {
			expect(errors).toHaveProperty("0.field", "hello.1")
		}
	})
})
