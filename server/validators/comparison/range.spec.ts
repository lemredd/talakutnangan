import makeInitialState from "!/validators/make_initial_state"
import range from "./range"

describe("Validator pipe: range", () => {
	it("can accept valid input", async () => {
		const value = Promise.resolve(makeInitialState(6))
		const constraints = {
			request: null,
			source: null,
			field: "hello",
			range: {
				minimimum: 6,
				maximimum: 6
			}
		}

		const sanitizeValue = (await range(value, constraints)).value

		expect(sanitizeValue).toEqual(6)
	})

	it("cannot accept fewer input", async () => {
		const value = Promise.resolve(makeInitialState(1))
		const constraints = {
			request: null,
			source: null,
			field: "hello",
			range: {
				minimum: 2
			}
		}

		const error = range(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
	})

	it("cannot accept greater input", async () => {
		const value = Promise.resolve(makeInitialState(4))
		const constraints = {
			request: null,
			source: null,
			field: "hello",
			range: {
				maximum: 0
			}
		}

		const error = range(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
	})
})
