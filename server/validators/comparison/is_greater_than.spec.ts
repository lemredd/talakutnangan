import makeInitialState from "!/validators/make_initial_state"
import isGreaterThan from "./is_greater_than"

describe("Validator pipe: Is greater than", () => {
	it("can accept valid input", async() => {
		const value = Promise.resolve(makeInitialState(5))
		const constraints = {
			"field": "hello",
			"isGreaterThan": {
				"value": 4
			},
			"request": null,
			"source": null
		}

		const sanitizeValue = (await isGreaterThan(value, constraints)).value

		expect(sanitizeValue).toEqual(5)
	})

	it("can accept valid pointer", async() => {
		const value = Promise.resolve(makeInitialState(3))
		const constraints = {
			"field": "hello",
			"isGreaterThan": {
				"pointer": "user.id"
			},
			"request": null,
			"source": {
				"user": {
					"id": 1
				}
			}
		}

		const sanitizeValue = (await isGreaterThan(value, constraints)).value

		expect(sanitizeValue).toEqual(3)
	})

	it("can accept date", async() => {
		const currentDate = new Date()
		const value = Promise.resolve(makeInitialState(new Date()))
		const constraints = {
			"field": "hello",
			"isGreaterThan": {
				"pointer": "user.id"
			},
			"request": null,
			"source": {
				"user": {
					"id": new Date(Date.now() - 1)
				}
			}
		}

		const sanitizeValue = (await isGreaterThan(value, constraints)).value

		expect(sanitizeValue).toEqual(currentDate)
	})

	it("cannot accept invalid input", () => {
		const value = Promise.resolve(makeInitialState("foo"))
		const constraints = {
			"field": "hello",
			"isGreaterThan": {
				"value": "world"
			},
			"request": null,
			"source": null
		}

		const error = isGreaterThan(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})
