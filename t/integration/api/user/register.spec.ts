import { StatusCodes } from "http-status-codes"
import User from "!/models/user"

import App from "~/app"
import Database from "~/database"
import UserFactory from "~/factories/user"

describe("POST /api/user/register", () => {
	it("can be accessed by guest and request with non-existing credentials", async () => {
		const manager = Database.manager
		const user = await (new UserFactory()).makeOne()

		const response = await App.request
			.post("/api/user/register")
			.send({
				email: user.email,
				password: user.password
			})

		expect(response.statusCode).toBe(StatusCodes.OK)
		expect(response.body).toHaveProperty("token")

		const foundUser = await manager.findOneBy(User, {
			email: user.email
		})
		expect(foundUser.email).toEqual(user.email)
	})

	it.todo("can insert already existing email")

	it.todo("can insert invalid credentials")

	it("cannot be accessed by authenticated users", async () => {
		const { user, cookie } = await App.makeAuthenticatedCookie()
		const response = await App.request
			.post("/api/user/register")
			.set("Cookie", cookie)
			.send({
				email: user.email,
				password: user.password
			})

		expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
		expect(response.body).toHaveProperty("errors")
	})
})
