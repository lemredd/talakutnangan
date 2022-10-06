import helper from "./convert_dates"

describe("Helpers: Convert dates", () => {
	it("can convert At to dates", () => {
		const value = {
			"createdAt": "1995-12-17T03:22:00",
			"deletedAt": "1995-12-17T03:22:00",
			"hello": {
				"name": "sample name 2",
				"subcreatedAt": "1995-12-17T03:19:00",
				"subdeletedAt": "1995-12-17T03:20:00"
			},
			"name": "sample name"
		}
		const expectedValue = {
			"createdAt": new Date("1995-12-17T03:22:00"),
			"deletedAt": new Date("1995-12-17T03:22:00"),
			"hello": {
				"name": "sample name 2",
				"subcreatedAt": new Date("1995-12-17T03:19:00"),
				"subdeletedAt": new Date("1995-12-17T03:20:00")
			},
			"name": "sample name"
		}

		const result = helper(value)

		expect(result).toStrictEqual(expectedValue)
	})
})
