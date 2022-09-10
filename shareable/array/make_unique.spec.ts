import makeUnique from "./make_unique"

describe("Helpers: Make unique", () => {
	it("can remove duplicates", () => {
		const value = [ "a", "a", "b", "c", "c" ]

		const result = makeUnique(value)

		expect(result).toEqual([ "a", "b", "c" ])
	})
})
