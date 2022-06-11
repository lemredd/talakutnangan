import { StatusCodes } from "http-status-codes"
import UserManager from "%/managers/user_manager"

import App from "~/app"
import UserFactory from "~/factories/user"
import Route from "!/app/routes/api/user/list.get"

describe("GET /api/user/list", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by permitted user and get single unadmitted user", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).insertOne()

		const response = await App.request
			.get("/api/user/list")
			.query({ criteria: "unadmitted" })

		expect(response.statusCode).toBe(StatusCodes.OK)
		const expectedUser = await manager.findWithID(user.id)
		expect(response.body).toStrictEqual(
			JSON.parse(JSON.stringify([
				expectedUser
			]))
		)
	})

	it.todo("can be accessed by permitted user and get multiple unadmitted users")
	it.todo("cannot be accessed by guest users")
})
