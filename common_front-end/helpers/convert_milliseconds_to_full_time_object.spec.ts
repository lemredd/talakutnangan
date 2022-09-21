import convertMillisecondsToFullTimeObject from "./convert_milliseconds_to_full_time_object"

describe("Database: Convert milliseconds to full time object", () => {
	it("can convert minutes to time object", () => {
		const ONE_MINUTE_AND_THIRTY_SECONDS = 90_000

		const time = convertMillisecondsToFullTimeObject(ONE_MINUTE_AND_THIRTY_SECONDS)

		expect(time).toStrictEqual({
			"hours": 0,
			"minutes": 1,
			"seconds": 30
		})
	})

	it("can convert seconds to time object", () => {
		const TEN_SECONDS = 10_000

		const time = convertMillisecondsToFullTimeObject(TEN_SECONDS)

		expect(time).toStrictEqual({
			"hours": 0,
			"minutes": 0,
			"seconds": 10
		})
	})
})
