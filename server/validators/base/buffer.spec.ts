import type { ValidationConstraints, BufferRuleConstraints } from "!/types/validation"
import makeInitialState from "!/validators/make_initial_state"
import buffer from "./buffer"

describe("Validator pipe: buffer", () => {
	it("can accept valid input", async() => {
		const value = Promise.resolve(makeInitialState({
			"buffer": Buffer.from(""),
			"info": {
				"mimeType": "text/plain"
			}
		}))
		const constraints: ValidationConstraints & Partial<BufferRuleConstraints> = {
			"buffer": {
				"allowedMimeTypes": [ "text/plain" ],
				"maximumSize": 0,
				"minimumSize": 0
			},
			"field": "hello",
			"request": null,
			"source": null
		}

		const sanitizeValue = (await buffer(value, constraints)).value

		expect(sanitizeValue).toStrictEqual({
			"buffer": Buffer.from(""),
			"info": {
				"mimeType": "text/plain"
			}
		})
	})

	it("cannot accept large buffer", async() => {
		const value = Promise.resolve(makeInitialState({
			"buffer": Buffer.from("000000"),
			"info": {
				"mimeType": "text/plain"
			}
		}))
		const constraints: ValidationConstraints & Partial<BufferRuleConstraints> = {
			"buffer": {
				"allowedMimeTypes": [ "text/css" ],
				"maximumSize": 5,
				"minimumSize": 0
			},
			"field": "hello",
			"request": null,
			"source": null
		}

		try {
			await buffer(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})

	it("cannot accept invalid media type", async() => {
		const value = Promise.resolve(makeInitialState({
			"buffer": Buffer.from(""),
			"info": {
				"mimeType": "text/plain"
			}
		}))
		const constraints: ValidationConstraints & Partial<BufferRuleConstraints> = {
			"buffer": {
				"allowedMimeTypes": [ "text/css" ],
				"maximumSize": 0,
				"minimumSize": 0
			},
			"field": "hello",
			"request": null,
			"source": null
		}

		try {
			await buffer(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})
})
