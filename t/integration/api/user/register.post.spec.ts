import { StatusCodes } from "http-status-codes"
import UserManager from "%/managers/user_manager"

import App from "~/app"
import UserFactory from "~/factories/user"
import Route from "!/app/routes/api/user/register.post"

// TODO: Remove after creating the route to import the CSV file
describe.skip("POST /api/user/register", () => {
	beforeAll(async () => {
		await App.create("/api/user", new Route())
	})

	it("can be accessed by guest and request with non-existing credentials", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).makeOne()

		const response = await App.request
			.post("/api/user/register")
			.send({
				email: user.email,
				password: user.password
			})

		expect(response.statusCode).toBe(StatusCodes.OK)
		expect(response.body).toHaveProperty("token")

		const foundUser = await manager.findWithCredentials(user.email, user.password)
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
