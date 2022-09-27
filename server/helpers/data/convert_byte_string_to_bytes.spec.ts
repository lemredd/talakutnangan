/* eslint-disable no-magic-numbers */
import convertByteStringToBytes from "./convert_byte_string_to_bytes"

describe("Helpers: Convert byte string to bytes", () => {
	it("can convert megabyte", () => {
		const string = "10MB"

		const bytes = convertByteStringToBytes(string)

		expect(bytes).toEqual(10 * 1000 * 1000)
	})

	it("can convert kilobyte", () => {
		const string = "10kB"

		const bytes = convertByteStringToBytes(string)

		expect(bytes).toEqual(10 * 1000)
	})

	it("can convert byte", () => {
		const string = "10B"

		const bytes = convertByteStringToBytes(string)

		expect(bytes).toEqual(10)
	})
})
