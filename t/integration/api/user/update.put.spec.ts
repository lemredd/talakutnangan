import { StatusCodes } from "http-status-codes"
import UserManager from "%/managers/user"

import App from "~/app"
import UserFactory from "~/factories/user"
import Route from "!/app/routes/api/user/update(id).put"

describe("PUT /api/user/update/:id", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it.skip("can be accessed by permitted user and admit other user", async () => {
		const manager = new UserManager()
		const { user: admin, cookie } = await App.makeAuthenticatedCookie()
		const student = await (new UserFactory()).insertOne()

		const response = await App.request
			.put(`/api/user/update/${student.id}`)
			.set("Cookie", cookie)

		expect(response.statusCode).toBe(StatusCodes.ACCEPTED)

		const updatedStudent = await manager.findWithID(student.id)
		expect(updatedStudent!.admittedAt).not.toBeNull()
	})

	it.todo("can be accessed by permitted user and admit multiple users")
	it.todo("can be accessed by permitted user and readmit users")
	it.todo("cannot be accessed by guest users")
})
