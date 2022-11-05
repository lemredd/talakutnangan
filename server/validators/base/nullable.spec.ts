import makeInitialState from "!/validators/make_initial_state"
import nullable from "./nullable"

describe("Validator pipe: nullable", () => {
	it("can accept valid input", async() => {
		const value = Promise.resolve(makeInitialState(null))
		const constraints = {
			"field": "hello",
			"request": null,
			"source": null
		}

		const sanitizeValue = (await nullable(value, constraints)).value

		expect(sanitizeValue).toEqual(null)
	})

	it("can accept boolean false", async() => {
		const value = Promise.resolve(makeInitialState(false))
		const constraints = {
			"field": "hello",
			"request": null,
			"source": null
		}

		const sanitizeValue = (await nullable(value, constraints)).value

		expect(sanitizeValue).toEqual(false)
	})

	it("can use default value", async() => {
		const value = Promise.resolve(makeInitialState(null))
		const constraints = {
			"field": "hello",
			"nullable": {
				"defaultValue": "world"
			},
			"request": null,
			"source": null
		}

		const state = (await nullable(value, constraints))

		expect(state.value).toEqual("world")
		expect(state.maySkip).toBeFalsy()
	})

	it("can consider empty string as null", async() => {
		const value = Promise.resolve(makeInitialState(""))
		const constraints = {
			"field": "hello",
			"nullable": {
				"defaultValue": null,
				"mayConsiderEmptyStringAsNull": true
			},
			"request": null,
			"source": null
		}

		const sanitizeValue = (await nullable(value, constraints)).value

		expect(sanitizeValue).toEqual(null)
	})

	it("can force skip after setting default value", async() => {
		const value = Promise.resolve(makeInitialState(null))
		const constraints = {
			"field": "hello",
			"nullable": {
				"defaultValue": "hello",
				"mustSkipAfterSettingDefault": true
			},
			"request": null,
			"source": null
		}

		const state = (await nullable(value, constraints))

		expect(state.value).toEqual("hello")
		expect(state.maySkip).toBeTruthy()
	})

	it("can skip if there is no default value", async() => {
		const value = Promise.resolve(makeInitialState(null))
		const constraints = {
			"field": "hello",
			"request": null,
			"source": null
		}

		const state = await nullable(value, constraints)

		expect(state.value).toBeNull()
		expect(state.maySkip).toBeTruthy()
	})
})
