import extractRouteInfo from "./extract_route_info"

describe("Helpers: Extract route info", () => {
	it("can extract API route", () => {
		const root = "/sample"
		const currentPath = `${root}/api/sample.post.ts`

		const { method, path, purpose } = extractRouteInfo(currentPath, root)

		expect(method).toBe("post")
		expect(path).toBe("/api/sample")
		expect(purpose).toBe("api")
	})

	it("can extract development route", () => {
		const root = "/sample"
		const currentPath = `${root}/dev/sample.get.ts`

		const { method, path, purpose } = extractRouteInfo(currentPath, root)

		expect(method).toBe("get")
		expect(path).toBe("/dev/sample")
		expect(purpose).toBe("dev")
	})

	it("can extract enhancer route", () => {
		const root = "/sample"
		const currentPath = `${root}/sample.get.ts`

		const { method, path, purpose } = extractRouteInfo(currentPath, root)

		expect(method).toBe("get")
		expect(path).toBe("/sample")
		expect(purpose).toBe("enhancer")
	})
})
