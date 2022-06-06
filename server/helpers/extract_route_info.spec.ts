import extractRouteInfo from "./extract_route_info"
import getRoot from "!/helpers/get_root"

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

	it("can extract with real path properly", () => {
		const currentPath = `${getRoot()}/server/app/routes/api/user/log_in.post.ts`

		const { method, path, purpose } = extractRouteInfo(currentPath)

		expect(method).toBe("post")
		expect(path).toBe("/api/user/log_in")
		expect(purpose).toBe("api")
	})
})
