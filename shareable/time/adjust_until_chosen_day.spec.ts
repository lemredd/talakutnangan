import adjustUntilChosenDay from "./adjust_until_chosen_day"

describe("Time helpers: Adjust until chosen day", () => {
	it("can go back", () => {
		const initialDate = new Date("2022-10-01T00:00:00")

		const adjustedDate = adjustUntilChosenDay(initialDate, 0, -1)

		expect(adjustedDate).toStrictEqual(new Date("2022-09-25T00:00:00"))
	})

	it("can go forward", () => {
		const initialDate = new Date("2022-10-31T00:00:00")

		const adjustedDate = adjustUntilChosenDay(initialDate, 6, 1)

		expect(adjustedDate).toStrictEqual(new Date("2022-11-05T00:00:00"))
	})

	it("can go forward at least once if forced", () => {
		const initialDate = new Date("2022-11-05T00:00:00")

		const adjustedDate = adjustUntilChosenDay(initialDate, 6, 7, { "force": true })

		expect(adjustedDate).toStrictEqual(new Date("2022-11-12T00:00:00"))
	})

	it("cannot go forward at least once if not forced", () => {
		const initialDate = new Date("2022-11-05T00:00:00")

		const adjustedDate = adjustUntilChosenDay(initialDate, 6, 7, { "force": false })

		expect(adjustedDate).toStrictEqual(new Date("2022-11-05T00:00:00"))
	})
})
