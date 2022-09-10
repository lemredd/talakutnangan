import subtract from "./subtract"

describe("Helpers: Subtract", () => {
	it("can subtract scalar values", () => {
		const subtrahend = [ "a", "b", "c" ]
		const minuend = [ "b", "c" ]

		const result = subtract(subtrahend, minuend)

		expect(result).toEqual([ "a" ])
	})

	it("can subtract composite values", () => {
		const subtrahend = [ { "value": "a" }, { "value": "b" }, { "value": "c" } ]
		const minuend = [ subtrahend[0] ]

		const result = subtract(subtrahend, minuend)

		expect(result).toStrictEqual([ subtrahend[1], subtrahend[2] ])
	})
})
