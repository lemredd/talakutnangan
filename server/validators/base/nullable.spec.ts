import makeInitialState from "!/validators/make_initial_state"
import nullable from "./nullable"

describe("Validator pipe: nullable", () => {
	it("can accept valid input", async () => {
		const value = Promise.resolve(makeInitialState(null))
		const constraints = { request: null, source: null, field: "hello" }

		const sanitizeValue = (await nullable(value, constraints)).value

		expect(sanitizeValue).toEqual(null)
	})

	it("can accept boolean false", async () => {
		const value = Promise.resolve(makeInitialState(false))
		const constraints = { request: null, source: null, field: "hello" }

		const sanitizeValue = (await nullable(value, constraints)).value

		expect(sanitizeValue).toEqual(false)
	})

	it("can use default value", async () => {
		const value = Promise.resolve(makeInitialState(null))
		const constraints = {
			request: null,
			source: null,
			field: "hello",
			nullable: {
				defaultValue: "world"
			}
		}

		const sanitizeValue = (await nullable(value, constraints)).value

		expect(sanitizeValue).toEqual("world")
	})

	it("can skip if there is no default value", async () => {
		const value = Promise.resolve(makeInitialState(null))
		const constraints = {
			request: null,
			source: null,
			field: "hello"
		}

		const state = await nullable(value, constraints)

		expect(state.value).toBeNull()
		expect(state.maySkip).toBeTruthy()
	})
})
