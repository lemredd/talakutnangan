import helper from "./stringify_ids"

describe("Helpers: Stringify IDs", () => {
	it("can convert IDs to string", () => {
		const value = {
			"createdAt": "1995-12-17T03:22:00",
			"deletedAt": "1995-12-17T03:22:00",
			"hello": {
				"count": 3,
				"id": 1,
				"name": "sample name 2",
				"subcreatedAt": "1995-12-17T03:19:00",
				"subdeletedAt": "1995-12-17T03:20:00"
			},
			"id": 1,
			"name": "sample name"
		}
		const expectedValue = {
			"createdAt": "1995-12-17T03:22:00",
			"deletedAt": "1995-12-17T03:22:00",
			"hello": {
				"count": 3,
				"id": "1",
				"name": "sample name 2",
				"subcreatedAt": "1995-12-17T03:19:00",
				"subdeletedAt": "1995-12-17T03:20:00"
			},
			"id": "1",
			"name": "sample name"
		}

		const result = helper(value)

		expect(result).toStrictEqual(expectedValue)
	})
})
