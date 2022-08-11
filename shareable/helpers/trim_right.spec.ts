import trimRight from "./trim_right"

describe("Helper: Trim right", () => {
	it("can trim spaces", async() => {
		const value = "Hello    "

		const trimmedValue = trimRight(value)

		expect(trimmedValue).toBe("Hello")
	})

	it("can trim other characters", async() => {
		const value = "Hello;"

		const trimmedValue = trimRight(value, ";")

		expect(trimmedValue).toBe("Hello")
	})
})
