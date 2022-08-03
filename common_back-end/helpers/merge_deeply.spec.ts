import mergeDeeply from "./merge_deeply"

describe("Helper: Merge deeply", () => {
	it("can set deep paths with existing values", () => {
		const object = { a: { b: 2 } }
		const otherObject = { a: { c: 1 } }

		const newObject = mergeDeeply(object, otherObject)

		expect(newObject).toStrictEqual({
			a: {
				b: 2,
				c: 1
			}
		})
	})
})
