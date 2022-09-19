/* eslint-disable no-magic-numbers */
import convertTimeToMilliseconds from "./convert_time_to_milliseconds"

describe("Helpers: Convert hours to milliseconds", () => {
	it("can convert up to minutes", () => {
		const time = "23:59"

		const minutes = convertTimeToMilliseconds(time)

		expect(minutes).toBe(23 * 60 * 60 * 1000 + 59 * 60 * 1000)
	})

	it("can convert up to seconds", () => {
		const time = "23:59:58"

		const minutes = convertTimeToMilliseconds(time)

		expect(minutes).toBe(23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 58 * 1000)
	})
})
