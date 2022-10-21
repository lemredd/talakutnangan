import string from "!/validators/base/string"
import makeInitialState from "!/validators/make_initial_state"
import object from "./object"

describe("Validator pipe: object", () => {
	it("can accept valid input", async() => {
		const value = Promise.resolve(makeInitialState({
			"foo": "bar",
			"hello": "world"
		}))
		const constraints = {
			"field": "hello",
			"object": {
				"foo": {
					"constraints": {},
					"pipes": [ string ]
				},
				"hello": {
					"constraints": {},
					"pipes": [ string ]
				}
			},
			"request": null,
			"source": null
		}

		const sanitizeValue = (await object(value, constraints)).value

		expect(sanitizeValue).toStrictEqual({
			"foo": "bar",
			"hello": "world"
		})
	})

	it("can pass original source", async() => {
		const value = Promise.resolve(makeInitialState({
			"foo": "bar",
			"hello": "world"
		}))
		const source = Symbol("source")
		const customPipeA = jest.fn(unusedValue => unusedValue)
		const customPipeB = jest.fn(unusedValue => unusedValue)
		const constraints = {
			"field": "hello",
			"object": {
				"foo": {
					"constraints": {},
					"pipes": [ customPipeB ]
				},
				"hello": {
					"constraints": {},
					"pipes": [ customPipeA ]
				}
			},
			"request": null,
			source
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
			"field": "hello",
			"object": {
				"hello": {
					"constraints": {},
					"pipes": [ customPipe ]
				}
			},
			"request": null,
			"source": null
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

	it("cannot accept invalid input with friendly names", async() => {
		const value = Promise.resolve(makeInitialState({
			"foo": 2,
			"hello": 2
		}))
		const constraints = {
			"field": "hi",
			"object": {
				"foo": {
					"constraints": {},
					"friendlyName": "bar",
					"pipes": [ string ]
				},
				"hello": {
					"constraints": {},
					"friendlyName": "world",
					"pipes": [ string ]
				}
			},
			"request": null,
			"source": null
		}

		try {
			await object(value, constraints)
		} catch (errors) {
			expect(errors).toHaveLength(2)
			expect(errors).toHaveProperty("0.friendlyName", "bar")
			expect(errors).toHaveProperty("1.friendlyName", "world")
		}
	})

	it("cannot accept invalid input", async() => {
		const value = Promise.resolve(makeInitialState({
			"foo": 2,
			"hello": 2
		}))
		const constraints = {
			"field": "hi",
			"object": {
				"foo": {
					"constraints": {},
					"pipes": [ string ]
				},
				"hello": {
					"constraints": {},
					"pipes": [ string ]
				}
			},
			"request": null,
			"source": null
		}

		try {
			await object(value, constraints)
		} catch (errors) {
			expect(errors).toHaveLength(2)
			expect(errors).toHaveProperty("0.field", "hi.foo")
			expect(errors).toHaveProperty("1.field", "hi.hello")
		}
	})
})
