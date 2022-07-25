import getRoot from "$!/helpers/get_root"

import accessDeepPath from "./access_deep_path"

describe("Helpers: Access deep path", () => {
	it("can access deep paths with existing values", () => {
		const object = { a: { b: 1 } }
		const path = "a.b"

		const value = accessDeepPath(object, path)

		expect(value).toBe(1)
	})

	it("can access through array with existing values", () => {
		const object = { a: [ { b: 2 } ] }
		const path = "a.0.b"

		const value = accessDeepPath(object, path)

		expect(value).toBe(2)
	})

	it("can use null as fallback", () => {
		const object = { a: 0 }
		const path = "a.1.b"

		const value = accessDeepPath(object, path)

		expect(value).toBeNull()
	})

	it("can customize fallback", () => {
		const object = { a: 0 }
		const path = "a.2.b"

		const value = accessDeepPath(object, path, 4)

		expect(value).toBe(4)
	})
})
