import encrypt from "$!/auth/encrypt"
import URLMaker from "./url_maker"

describe("Database: API Link Creator", () => {
	it("can make base URL without custom port", () => {
		URLMaker.initialize("http", "localhost", 0, "/api");

		const baseURL = URLMaker.makeBaseURL()

		expect(baseURL).toBe("http://localhost/api")
	})

	it("can make base URL with custom port", () => {
		URLMaker.initialize("http", "localhost", 16000, "/api");

		const baseURL = URLMaker.makeBaseURL()

		expect(baseURL).toBe("http://localhost:16000/api")
	})

	it("can make base path", () => {
		URLMaker.initialize("http", "localhost", 16000, "/api");

		const baseURL = URLMaker.makeBaseModelPath("user")

		expect(baseURL).toBe("/api/user")
	})

	it("can make initial page links", () => {
		URLMaker.initialize("http", "localhost", 16000, "/api");

		const document = URLMaker.addPaginationLinks({}, "user", 1, 3)

		expect(document).toStrictEqual({
			links: {
				first: "/api/user/list?page=1",
				last: "/api/user/list?page=3",
				prev: null,
				next: "/api/user/list?page=2"
			}
		})
	})

	it("can make middle page links", () => {
		URLMaker.initialize("http", "localhost", 16000, "/api");

		const document = URLMaker.addPaginationLinks({}, "user", 2, 3)

		expect(document).toStrictEqual({
			links: {
				first: "/api/user/list?page=1",
				last: "/api/user/list?page=3",
				prev: "/api/user/list?page=1",
				next: "/api/user/list?page=3"
			}
		})
	})

	it("can make last page links", () => {
		URLMaker.initialize("http", "localhost", 16000, "/api");

		const document = URLMaker.addPaginationLinks({}, "user", 3, 3)

		expect(document).toStrictEqual({
			links: {
				first: "/api/user/list?page=1",
				last: "/api/user/list?page=3",
				prev: "/api/user/list?page=2",
				next: null
			}
		})
	})

	it("can make encrypted path", async () => {
		URLMaker.initialize("http", "localhost", 16000, "/");
		const data = JSON.stringify({
			email: "admin@example.com"
		})

		const path = await URLMaker.makeEncryptedPath("/user/verify", data)

		expect(path).toBe(`/user/verify/${await encrypt(data)}`)
	})

	it("can make encrypted URL", async () => {
		URLMaker.initialize("http", "localhost", 16000, "/");
		const data = JSON.stringify({
			email: "admin@example.com"
		})

		const path = await URLMaker.makeEncryptedURL("/user/verify", data)

		expect(path).toBe(`http://localhost:16000/user/verify/${await encrypt(data)}`)
	})
})
