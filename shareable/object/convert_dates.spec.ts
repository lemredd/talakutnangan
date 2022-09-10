import convertDates from "./convert_dates"

describe("Helpers: Convert dates", () => {
	it("can convert At to dates", () => {
		const value = {
			"name": "sample name",
			"createdAt": "1995-12-17T03:22:00",
			"deletedAt": "1995-12-17T03:22:00",
			"hello": {
				"name": "sample name 2",
				"subcreatedAt": "1995-12-17T03:19:00",
				"subdeletedAt": "1995-12-17T03:20:00"
			}
		}
		const expectedValue = {
			"name": "sample name",
			"createdAt": new Date("1995-12-17T03:22:00"),
			"deletedAt": new Date("1995-12-17T03:22:00"),
			"hello": {
				"name": "sample name 2",
				"subcreatedAt": new Date("1995-12-17T03:19:00"),
				"subdeletedAt": new Date("1995-12-17T03:20:00")
			}
		}

		const result = convertDates(value)

		expect(result).toStrictEqual(expectedValue)
	})
})
