import makeInitialState from "!/validators/make_initial_state"
import buffer from "./buffer"

describe("Validator pipe: buffer", () => {
	it("can accept valid input", async () => {
		const value = Promise.resolve(makeInitialState({
			buffer: Buffer.from(""),
			info: {
				mimeType: "text/plain"
			}
		}))
		const constraints = {
			request: null,
			source: null,
			field: "hello",
			buffer: {
				allowedMimeTypes: [ "text/plain" ],
				maxSize: 0
			}
		}

		const sanitizeValue = (await buffer(value, constraints)).value

		expect(sanitizeValue).toStrictEqual({
			buffer: Buffer.from(""),
			info: {
				mimeType: "text/plain"
			}
		})
	})

	it("cannot accept large buffer", async () => {
		const value = Promise.resolve(makeInitialState({
			buffer: Buffer.from("000000"),
			info: {
				mimeType: "text/plain"
			}
		}))
		const constraints = {
			request: null,
			source: null,
			field: "hello",
			buffer: {
				allowedMimeTypes: [ "text/css" ],
				maxSize: 5
			}
		}

		const error = buffer(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})

	it("cannot accept invalid media type", async () => {
		const value = Promise.resolve(makeInitialState({
			buffer: Buffer.from(""),
			info: {
				mimeType: "text/plain"
			}
		}))
		const constraints = {
			request: null,
			source: null,
			field: "hello",
			buffer: {
				allowedMimeTypes: [ "text/css" ],
				maxSize: 0
			}
		}

		const error = buffer(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})
