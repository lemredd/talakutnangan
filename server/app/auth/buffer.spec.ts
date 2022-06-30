import type { Validator } from "node-input-validator"
import buffer from "./buffer"

describe("Validator: Buffer", () => {
	it("can validate normal buffer", () => {
		const validator = {}
		const value = {
			buffer: Buffer.from(""),
			info: {
				mimeType: "text/plain"
			}
		}
		const args = [ "text/plain", "0" ]

		const isValid = buffer({ value, args }, validator as Validator)

		expect(isValid).toBeTruthy()
	})

	it("can invalidate text field", () => {
		const validator = {}
		const value = "sample"
		const args = [ "text/plain", "0" ]

		const isValid = buffer({ value, args }, validator as Validator)

		expect(isValid).toBeFalsy()
	})

	it("can invalidate large buffer", () => {
		const validator = {}
		const value = {
			buffer: Buffer.from("1234"),
			info: {
				mimeType: "text/plain"
			}
		}
		const args = [ "text/plain", "3" ]

		const isValid = buffer({ value, args }, validator as Validator)

		expect(isValid).toBeFalsy()
	})

	it("should error on insufficient arguments", () => {
		const validator = {}
		const value = {
			buffer: Buffer.from(""),
			info: {
				mimeType: "text/plain"
			}
		}
		const args = [ "text/plain" ]

		expect(() => buffer({ value, args }, validator as Validator)).toThrow()
	})

	it("should error on invalid max size argument", () => {
		const validator = {}
		const value = {
			buffer: Buffer.from(""),
			info: {
				mimeType: "text/plain"
			}
		}
		const args = [ "text/plain", "abc" ]

		expect(() => buffer({ value, args }, validator as Validator)).toThrow()
	})
})
