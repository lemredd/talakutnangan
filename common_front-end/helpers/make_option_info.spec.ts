import helper from "./make_option_info"

describe("Helper: Option info maker", () => {
	describe("Single Option Info", () => {
		it("can make option info with a given value", () => {
			const value = "option"

			expect(helper(value)).toStrictEqual({
				"label": value,
				value
			})
		})

		it("can make option info with a given value and label", () => {
			const value = 1
			const label = "option"

			expect(helper(value, label)).toStrictEqual({
				label,
				value
			})
		})
	})

	describe("Multiple option infos", () => {
		it("can make option infos with a given array", () => {
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

		it("can make option infos with a given array of values and label", () => {
			const value = [ 1, 2 ]
			const label = [ "option 1", "option 2" ]

			expect(helper(value, label)).toStrictEqual([
				{
					"label": label[0],
					"value": value[0]
				},
				{
					"label": label[1],
					"value": value[1]
				}
			])
		})
	})
})
