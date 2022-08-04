import setDeepPath from "./set_deep_path"

describe("Helper: Set deep path", () => {
	it("can set deep paths with existing values", () => {
		const object = { a: { b: 1 } }
		const path = "a.b"

		const newObject = setDeepPath(object, path, 2)

		expect(newObject).toStrictEqual({
			a: {
				b: 2
			}
		})
	})

	it("can set deep paths with array like syntax", () => {
		const object = { a: {} }
		const path = "a[b]"

		const newObject = setDeepPath(object, path, 3)

		expect(newObject).toStrictEqual({
			a: {
				b: 3
			}
		})
	})

	it("can set default values accordingly", () => {
		const object = { a: [ { b: 2 } ] }
		const path = "a.1.b.0.c"

		const newObject = setDeepPath(object, path, 6)

		expect(newObject).toStrictEqual({
			a: [
				{ b: 2 },
				{ b: [
					{ c: 6}
				] }
			]
		})
	})
})
