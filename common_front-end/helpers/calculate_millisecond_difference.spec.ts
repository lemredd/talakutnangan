import calculateMillisecondDifference from "./calculate_millisecond_difference"

describe("Helper: Calculate milliscond difference", () => {
	it("should return to zero for same date", () => {
		const date = new Date()
		const rawSubtrahend = date
		const rawMinuend = date

		const difference = calculateMillisecondDifference(rawSubtrahend, rawMinuend)

		expect(difference).toEqual(0)
	})

	it("should return to negative if minuend is in the future", () => {
		const rawSubtrahend = new Date()
		const rawMinuend = new Date()

		const difference = calculateMillisecondDifference(rawSubtrahend, rawMinuend)

		expect(difference).toBeLessThan(0)
	})

	it("should return to negative if minuend is in the past", () => {
		const rawMinuend = new Date()
		const rawSubtrahend = new Date()

		const difference = calculateMillisecondDifference(rawSubtrahend, rawMinuend)

		expect(difference).toBeGreaterThan(0)
	})
})
