import helper from "./make_option_info"

describe("Helper: Option info maker", () => {
	it("can make option info with a given value", () => {
		const value = "option"

		expect(helper(value)).toStrictEqual({
			"label": value,
			value
		})
	})
	it("can make option info with a given array", () => {
		const value = [ "option 1", "option 2" ]

		expect(helper(value)).toStrictEqual([
			{
				"label": value[0],
				"value": value[0]
			},
			{
				"label": value[1],
				"value": value[1]
			}
		])
	})
})
