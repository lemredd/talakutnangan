import { compare } from "bcryptjs"
import hash from "./hash"

describe("Security: Password hasing", () => {
	it("can hash password", async () => {
		const rawPassword = "hello world"

		const hashedPassword = await hash(rawPassword)

		expect(await compare(rawPassword, hashedPassword)).toBeTruthy()
	})
})
