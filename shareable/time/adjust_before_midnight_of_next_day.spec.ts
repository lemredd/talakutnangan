import adjustBeforeMidnightOfNextDay from "./adjust_before_midnight_of_next_day"

describe("Time helpers: Adjust before midnight of next day", () => {
	it("can adjust until before midnight of next day", () => {
		const initialDate = new Date("2022-10-01T00:00:00")

		const adjustedDate = adjustBeforeMidnightOfNextDay(initialDate)

		expect(adjustedDate).toStrictEqual(new Date("2022-10-01T11:59:59.999"))
	})
})
