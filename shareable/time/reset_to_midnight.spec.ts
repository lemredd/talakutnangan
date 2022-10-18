import resetToMidnight from "./reset_to_midnight"

describe("Time helpers: Reset to midnight", () => {
	it("can reset to midnight of the day", () => {
		const initialDate = new Date("2022-10-01T23:59:59.999")

		const adjustedDate = resetToMidnight(initialDate)

		expect(adjustedDate).toStrictEqual(new Date("2022-10-01T00:00:00.000"))
	})
})
