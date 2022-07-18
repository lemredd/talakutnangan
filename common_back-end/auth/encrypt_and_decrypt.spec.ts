import encrypt from "./encrypt"
import decrypt from "./decrypt"

describe("Security: Encrypt and Decrypt", () => {
	// The two functions need each other. This why they need to tested together.
	it("can encrypt then decrypt", async () => {
		const text = "Hello World!"

		const encryptedHex = await encrypt(text)
		const decryptedText = await decrypt(encryptedHex)

		expect(decryptedText).toBe(text)
	})
})
