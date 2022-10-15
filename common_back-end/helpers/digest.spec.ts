import digest from "./digest"

describe("Helpers: Digest", () => {
	it("can access deep paths with existing values", async() => {
		const raw = Buffer.alloc(0)

		const checksum = await digest(raw)

		expect(checksum).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855")
	})
})
