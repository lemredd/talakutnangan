import { compare } from "bcryptjs"
import encrypt from "./encrypt"

describe("Security: Encryption", () => {
	it("can hash password", async () => {
		const rawPassword = "hello world"

		const hashedPassword = await encrypt(rawPassword)

		expect(await compare(rawPassword, hashedPassword)).toBeTruthy()
	})
})
