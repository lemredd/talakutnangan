import convertMinutesToTimeObject from "./convert_minutes_to_time_object"

describe("Database: Convert minutes to time object", () => {
	it("can convert hours to time object", () => {
		const ONE_HOUR_AND_THIRTY_MINUTES = 90

		const time = convertMinutesToTimeObject(ONE_HOUR_AND_THIRTY_MINUTES)

		expect(time).toStrictEqual({
			"hours": 1,
			"minutes": 30
		})
	})

	it("can convert minutes to time object", () => {
		const THIRTY_MINUTES = 30

		const time = convertMinutesToTimeObject(THIRTY_MINUTES)

		expect(time).toStrictEqual({
			"hours": 0,
			"minutes": 30
		})
	})
})
