import getRoot from "$!/helpers/get_root"

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

	it("can extract index enhancer route", () => {
		const root = "/sample"
		const currentPath = `${root}/index.get.ts`

		const { method, path, purpose } = extractRouteInfo(currentPath, root)

		expect(method).toBe("get")
		expect(path).toBe("/")
		expect(purpose).toBe("enhancer")
	})

	it("can extract subindex enhancer route", () => {
		const root = "/sample"
		const currentPath = `${root}/a/index.get.ts`

		const { method, path, purpose } = extractRouteInfo(currentPath, root)

		expect(method).toBe("get")
		expect(path).toBe("/a")
		expect(purpose).toBe("enhancer")
	})

	it("can extract route with argument", () => {
		const root = "/sample"
		const currentPath = `${root}/sample(id).get.ts`

		const { method, path, purpose } = extractRouteInfo(currentPath, root)

		expect(path).toBe("/sample/:id")
	})

	it("can extract with real path properly", () => {
		const currentPath = `${getRoot()}/routes/api/user/log_in.post.ts`

		const { method, path, purpose } = extractRouteInfo(currentPath)

		expect(method).toBe("post")
		expect(path).toBe("/api/user/log_in")
		expect(purpose).toBe("api")
	})

	it("can trim create route", () => {
		const root = "/sample"
		const currentPath = `${root}/api/create.post.ts`

		const { method, path, purpose } = extractRouteInfo(currentPath, root)

		expect(method).toBe("post")
		expect(path).toBe("/api")
		expect(purpose).toBe("api")
	})

	it("can trim subcreate route", () => {
		const root = "/sample"
		const currentPath = `${root}/api/user/create.post.ts`

		const { method, path, purpose } = extractRouteInfo(currentPath, root)

		expect(method).toBe("post")
		expect(path).toBe("/api/user")
		expect(purpose).toBe("api")
	})

	it("can trim update route", () => {
		const root = "/sample"
		const currentPath = `${root}/api/update(id).patch.ts`

		const { method, path, purpose } = extractRouteInfo(currentPath, root)

		expect(method).toBe("patch")
		expect(path).toBe("/api/:id")
		expect(purpose).toBe("api")
	})

	it("can trim subupdate route", () => {
		const root = "/sample"
		const currentPath = `${root}/api/user/update(id).patch.ts`

		const { method, path, purpose } = extractRouteInfo(currentPath, root)

		expect(method).toBe("patch")
		expect(path).toBe("/api/user/:id")
		expect(purpose).toBe("api")
	})

	it("can trim subupdate route without parameter", () => {
		const root = "/sample"
		const currentPath = `${root}/api/user/update.patch.ts`

		const { method, path, purpose } = extractRouteInfo(currentPath, root)

		expect(method).toBe("patch")
		expect(path).toBe("/api/user")
		expect(purpose).toBe("api")
	})
})
