import string from "!/validators/base/string"
import makeInitialState from "!/validators/make_initial_state"
import object from "./object"

describe("Validator pipe: object", () => {
	it("can accept valid input", async() => {
		const value = Promise.resolve(makeInitialState({
			"hello": "world",
			"foo": "bar"
		}))
		const constraints = {
			"request": null,
			"source": null,
			"field": "hello",
			"object": {
				"hello": {
					"pipes": [ string ],
					"constraints": {}
				},
				"foo": {
					"pipes": [ string ],
					"constraints": {}
				}
			}
		}

		const sanitizeValue = (await object(value, constraints)).value

		expect(sanitizeValue).toStrictEqual({
			"hello": "world",
			"foo": "bar"
		})
	})

	it("can pass original source", async() => {
		const value = Promise.resolve(makeInitialState({
			"hello": "world",
			"foo": "bar"
		}))
		const source = Symbol("source")
		const customPipeA = jest.fn(unusedValue => unusedValue)
		const customPipeB = jest.fn(unusedValue => unusedValue)
		const constraints = {
			"request": null,
			source,
			"field": "hello",
			"object": {
				"hello": {
					"pipes": [ customPipeA ],
					"constraints": {}
				},
				"foo": {
					"pipes": [ customPipeB ],
					"constraints": {}
				}
			}
		}

		await object(value, constraints)

		expect(customPipeA).toHaveBeenCalled()
		expect(customPipeA.mock.calls[0]).toHaveProperty("1.source", source)
		expect(customPipeB).toHaveBeenCalled()
		expect(customPipeB.mock.calls[0]).toHaveProperty("1.source", source)
	})

	it("can refresh values", async() => {
		const value = Promise.resolve(makeInitialState({}))
		const customPipe = jest.fn().mockResolvedValue(makeInitialState("world"))
		const constraints = {
			"request": null,
			"source": null,
			"field": "hello",
			"object": {
				"hello": {
					"pipes": [ customPipe ],
					"constraints": {}
				}
			}
		}

		const sanitizedInput = (await object(value, constraints)).value

		expect(customPipe).toHaveBeenCalled()
		expect(customPipe.mock.calls[0][0]).resolves.toStrictEqual({
			"maySkip": false,
			// eslint-disable-next-line no-undefined
			"value": undefined
		})
		expect(sanitizedInput).toStrictEqual({ "hello": "world" })
	})

	it("cannot accept invalid input", () => {
		const value = Promise.resolve(makeInitialState({
			"hello": 2,
			"foo": 2
		}))
		const constraints = {
			"request": null,
			"source": null,
			"field": "hi",
			"object": {
				"hello": {
					"pipes": [ string ],
					"constraints": {}
				},
				"foo": {
					"pipes": [ string ],
					"constraints": {}
				}
			}
		}

		const error = object(value, constraints)

		expect(error).rejects.toHaveLength(2)
		expect(error).rejects.toHaveProperty("0.field", "hi.foo")
		expect(error).rejects.toHaveProperty("1.field", "hi.hello")
	})
})
