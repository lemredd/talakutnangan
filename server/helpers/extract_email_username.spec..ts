import extractEmailUsername from "./extract_email_username"

describe("Helpers: Extract email username", () => {
	it("can get email username", () => {
		const email = "sample@example.com"

		const password = extractEmailUsername(email)

		expect(password).toBe("sample")
	})
})
