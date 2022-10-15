import makeInitialState from "!/validators/make_initial_state"
import acronym from "./acronym"

describe("Validator pipe: acronym", () => {
	it("can accept valid input", async() => {
		const value = Promise.resolve(makeInitialState("AD"))
		const constraints = {
			"request": null,
			"source": { "name": "Abc Defgh" },
			"field": "hello",
			"acronym": {
				"spelledOutPath": "name"
			}
		}

		const sanitizeValue = (await acronym(value, constraints)).value

		expect(sanitizeValue).toEqual("AD")
	})

	it("can accept valid special input", async() => {
		const value = Promise.resolve(makeInitialState("AbDe"))
		const constraints = {
			"request": null,
			"source": { "name": "Abc Defgh" },
			"field": "hello",
			"acronym": {
				"spelledOutPath": "name"
			}
		}

		const sanitizeValue = (await acronym(value, constraints)).value

		expect(sanitizeValue).toEqual("AbDe")
	})

	it("can accept valid input with special characters", async() => {
		const value = Promise.resolve(makeInitialState("ÉÑ"))
		const constraints = {
			"request": null,
			"source": { "name": "Én Ñe" },
			"field": "hello",
			"acronym": {
				"spelledOutPath": "name"
			}
		}

		const sanitizeValue = (await acronym(value, constraints)).value

		expect(sanitizeValue).toEqual("ÉÑ")
	})

	it("can ignore words that start small", async() => {
		const value = Promise.resolve(makeInitialState("AbDe"))
		const constraints = {
			"request": null,
			"source": { "name": "Abc of Defgh" },
			"field": "hello",
			"acronym": {
				"spelledOutPath": "name"
			}
		}

		const sanitizeValue = (await acronym(value, constraints)).value

		expect(sanitizeValue).toEqual("AbDe")
	})

	it("cannot accept invalid input", async() => {
		const value = Promise.resolve(makeInitialState("AE"))
		const constraints = {
			"request": null,
			"source": { "name": "Abc Defgh" },
			"field": "hello",
			"acronym": {
				"spelledOutPath": "name"
			}
		}

		try {
			await acronym(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})

	it("cannot accept invalid secial input", async() => {
		const value = Promise.resolve(makeInitialState("AcDf"))
		const constraints = {
			"request": null,
			"source": { "name": "Abc Defgh" },
			"field": "hello",
			"acronym": {
				"spelledOutPath": "name"
			}
		}

		try {
			await acronym(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})

	it("cannot accept uneven word-letter ratio of source and acronym", async() => {
		const value = Promise.resolve(makeInitialState("AD"))
		const constraints = {
			"request": null,
			"source": { "name": "abc Def" },
			"field": "hello",
			"acronym": {
				"spelledOutPath": "name"
			}
		}

		try {
			await acronym(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})
})
