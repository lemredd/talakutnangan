import APILinks from "./api_links"

describe("Database: API Link Creator", () => {
	it("can make base URL without custom port", () => {
		APILinks.initialize("http", "localhost", 0, "/api");

		const baseURL = APILinks.makeBaseURL()

		expect(baseURL).toBe("http://localhost/api")
	})

	it("can make base URL with custom port", () => {
		APILinks.initialize("http", "localhost", 16000, "/api");

		const baseURL = APILinks.makeBaseURL()

		expect(baseURL).toBe("http://localhost:16000/api")
	})

	it("can make base path", () => {
		APILinks.initialize("http", "localhost", 16000, "/api");

		const baseURL = APILinks.makeBaseModelPath("user")

		expect(baseURL).toBe("/api/user")
	})

	it("can make initial page links", () => {
		APILinks.initialize("http", "localhost", 16000, "/api");

		const document = APILinks.addPaginationLinks({}, "user", 1, 3)

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
		APILinks.initialize("http", "localhost", 16000, "/api");

		const document = APILinks.addPaginationLinks({}, "user", 2, 3)

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
		APILinks.initialize("http", "localhost", 16000, "/api");

		const document = APILinks.addPaginationLinks({}, "user", 3, 3)

		expect(document).toStrictEqual({
			links: {
				first: "/api/user/list?page=1",
				last: "/api/user/list?page=3",
				prev: "/api/user/list?page=2",
				next: null
			}
		})
	})
})
