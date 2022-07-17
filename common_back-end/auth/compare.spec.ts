import { hash } from "bcryptjs"
import compare from "./compare"

describe("Security: Password Comparison", () => {
	it("can compare hashed passwords", async () => {
		const rawPassword = "hello world"
		const hashedPassword = await hash(rawPassword, 1)

		expect(await compare(rawPassword, hashedPassword)).toBeTruthy()
	})
})
