import encrypt from "$!/auth/encrypt"
import DecryptionError from "$!/errors/decryption"

import URLMaker from "./url_maker"

describe("Database: API Link Creator", () => {
	it("can make base URL without custom port", () => {
		URLMaker.initialize("http", "localhost", 0, "/api")

		const baseURL = URLMaker.makeBaseURL()

		expect(baseURL).toBe("http://localhost/api")
	})

	it("can make base URL with custom port", () => {
		URLMaker.initialize("http", "localhost", 16000, "/api")

		const baseURL = URLMaker.makeBaseURL()

		expect(baseURL).toBe("http://localhost:16000/api")
	})

	it("can make base path", () => {
		URLMaker.initialize("http", "localhost", 16000, "/api")

		const baseURL = URLMaker.makeBaseModelPath("user")

		expect(baseURL).toBe("/api/user")
	})

	it("can make initial page links", () => {
		URLMaker.initialize("http", "localhost", 16000, "/api")

		const document = URLMaker.addPaginationLinks({}, "user", 1, 3)

		expect(document).toStrictEqual({
			links: {
				first: "/api/user?page=1",
				last: "/api/user?page=3",
				prev: null,
				next: "/api/user?page=2"
			}
		})
	})

	it("can make middle page links", () => {
		URLMaker.initialize("http", "localhost", 16000, "/api")

		const document = URLMaker.addPaginationLinks({}, "user", 2, 3)

		expect(document).toStrictEqual({
			links: {
				first: "/api/user?page=1",
				last: "/api/user?page=3",
				prev: "/api/user?page=1",
				next: "/api/user?page=3"
			}
		})
	})

	it("can make last page links", () => {
		URLMaker.initialize("http", "localhost", 16000, "/api")

		const document = URLMaker.addPaginationLinks({}, "user", 3, 3)

		expect(document).toStrictEqual({
			links: {
				first: "/api/user?page=1",
				last: "/api/user?page=3",
				prev: "/api/user?page=2",
				next: null
			}
		})
	})

	it("can make URL from path template", () => {
		URLMaker.initialize("http", "localhost", 16000, "/")
		const data = {
			id: 1
		}

		const URL = URLMaker.makeURLFromPath("/signature/:id", data)

		expect(URL).toBe("http://localhost:16000/signature/1")
	})

	it("can make encrypted path", async () => {
		URLMaker.initialize("http", "localhost", 16000, "/")
		const data = JSON.stringify({
			email: "admin@example.com"
		})

		const path = await URLMaker.makeEncryptedPath("/user/verify", data)

		expect(path).toBe(`/user/verify/${await encrypt(data)}`)
	})

	it("can make encrypted URL", async () => {
		URLMaker.initialize("http", "localhost", 16000, "/")
		const data = JSON.stringify({
			email: "admin@example.com"
		})

		const path = await URLMaker.makeEncryptedURL("/user/verify", data)

		expect(path).toBe(`http://localhost:16000/user/verify/${await encrypt(data)}`)
	})

	it("can retain double slashes after protocol", () => {
		URLMaker.initialize("http", "localhost", 16000, "/")
		const part = "http://"

		const resolvedPart = URLMaker.removeRepeatingSlashes(part)

		expect(resolvedPart).toBe(part)
	})

	it("can remove double slashes after domain", () => {
		URLMaker.initialize("http", "localhost", 16000, "/")
		const part = "http://localhost//"

		const resolvedPart = URLMaker.removeRepeatingSlashes(part)

		expect(resolvedPart).toBe("http://localhost/")
	})

	it("can remove double slashes within path", () => {
		URLMaker.initialize("http", "localhost", 16000, "/")
		const part = "http://localhost/a//b//c"

		const resolvedPart = URLMaker.removeRepeatingSlashes(part)

		expect(resolvedPart).toBe("http://localhost/a/b/c")
	})

	it("can remove triple slashes within path", () => {
		URLMaker.initialize("http", "localhost", 16000, "/")
		const part = "http://localhost/a//b///c"

		const resolvedPart = URLMaker.removeRepeatingSlashes(part)

		expect(resolvedPart).toBe("http://localhost/a/b/c")
	})

	it("can resolve port 80", () => {
		URLMaker.initialize("http", "localhost", 80, "/")

		const resolvedPart = URLMaker.getResolvedPort()

		expect(resolvedPart).toBe("")
	})

	it("can resolve port 443", () => {
		URLMaker.initialize("http", "localhost", 80, "/")

		const resolvedPart = URLMaker.getResolvedPort()

		expect(resolvedPart).toBe("")
	})

	it("can make temporary URL", async () => {
		URLMaker.initialize("http", "localhost", 80, "/")
		const currentTime = new Date().getTime()
		const path = "/user/verify"
		const data = "Hello World!"
		const expireMillisecondDuration = 1000

		const temporaryURL = await URLMaker.makeTemporaryURL(
			path,
			{ data },
			expireMillisecondDuration,
			currentTime
		)

		expect(temporaryURL).toBe(`http://localhost/user/verify/${await encrypt(
			JSON.stringify([
				currentTime + expireMillisecondDuration,
				{ data }
			])
		)}`)
	})

	it("can decrypt URL data", async () => {
		URLMaker.initialize("http", "localhost", 80, "/")
		const data = "Hello World!"
		const encryptedURL = `http://localhost/encrypted/${await encrypt(data)}`

		const decryptedData = await URLMaker.decryptURLData(encryptedURL)

		expect(decryptedData).toBe(data)
	})

	it("cannot decrypt invalid URL data", async () => {
		URLMaker.initialize("http", "localhost", 80, "/")
		const data = "Hello World!"
		const encryptedURL = `http://localhost/encrypted/${await encrypt(data)}-${data}`

		expect(URLMaker.decryptURLData(encryptedURL)).rejects.toThrow(DecryptionError)
	})

	it("cannot decrypt missing URL data", async () => {
		URLMaker.initialize("http", "localhost", 80, "/")
		const data = "Hello World!"
		const encryptedURL = `http://localhost/`

		expect(URLMaker.decryptURLData(encryptedURL)).rejects.toThrow(DecryptionError)
	})

	it("can check temporary URL", async () => {
		URLMaker.initialize("http", "localhost", 80, "/")
		const currentTime = new Date().getTime()
		const path = "/temporary"
		const data = "Hello World!"
		const expireMillisecondDuration = 1000
		const temporaryURL = await URLMaker.makeTemporaryURL(
			path,
			{ data },
			expireMillisecondDuration,
			currentTime
		)

		const URLInfo = await URLMaker.checkTemporaryURL(temporaryURL, currentTime + 500)

		expect(URLInfo).toStrictEqual({
			hasExpired: false,
			data: { data }
		})
	})

	it("can check expired temporary URL", async () => {
		URLMaker.initialize("http", "localhost", 80, "/")
		const currentTime = new Date().getTime()
		const path = "/temporary"
		const data = "Hello World!"
		const expireMillisecondDuration = 1000
		const temporaryURL = await URLMaker.makeTemporaryURL(
			path,
			{ data },
			expireMillisecondDuration,
			currentTime
		)

		const URLInfo = await URLMaker.checkTemporaryURL(temporaryURL, currentTime + 1500)

		expect(URLInfo).toStrictEqual({
			hasExpired: true,
			data: { data }
		})
	})

	it("cannot check unparsable temporary URL", async () => {
		URLMaker.initialize("http", "localhost", 80, "/")
		const currentTime = new Date().getTime()
		const path = "/temporary"
		const data = "Hello World!"
		const temporaryURL = await URLMaker.makeEncryptedURL(
			path,
			data
		)

		expect(URLMaker.checkTemporaryURL(temporaryURL, currentTime)).rejects.toThrow(DecryptionError)
	})

	it("cannot check invalid temporary URL", async () => {
		URLMaker.initialize("http", "localhost", 80, "/")
		const currentTime = new Date().getTime()
		const path = "/temporary"
		const data = "Hello World!"
		const temporaryURL = await URLMaker.makeEncryptedURL(
			path,
			JSON.stringify({ data })
		)

		expect(URLMaker.checkTemporaryURL(temporaryURL, currentTime)).rejects.toThrow(DecryptionError)
	})
})
