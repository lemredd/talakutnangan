import helper from "./convert_time_object_to_time_string"

describe("Helper: Time string generator", () => {
	it("can make a time string from a given time object", () => {
		const timeObjectAM = {
			"hours": 4,
			"minutes": 30
		}
		const timeObjectPM = {
			"hours": 16,
			"minutes": 30
		}
		const expectedValue = "04:30"

		expect(helper(timeObjectAM)).toEqual(expectedValue)
		expect(helper(timeObjectPM)).toEqual(expectedValue)
	})
})
