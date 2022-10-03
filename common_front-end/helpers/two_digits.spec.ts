import helper from "./two_digits"

describe("Helper: Two digits", () => {
	it("can add a zero digit if less than 10", () => {
		const digit = 5
		const expectedOutcome = `0${digit}`

		expect(helper(digit)).toEqual(expectedOutcome)
	})

	it("should return the same value if digit is greater than 10", () => {
		const digit = 10

		expect(helper(digit)).toEqual(String(digit))
	})
})
