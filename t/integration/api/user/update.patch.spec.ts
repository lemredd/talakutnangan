import { StatusCodes } from "http-status-codes"
import User from "!/models/user"

import App from "~/app"
import Database from "~/database"
import UserFactory from "~/factories/user"

describe("PATCH /api/user/update/:id", () => {
	it("can be accessed by permitted user and admit other user", async () => {
		const manager = Database.manager
		// const admin = await (new UserFactory()).verified().insertOne()
		const student = await (new UserFactory()).verified().insertOne()

		const response = await App.request
			.patch(`/api/user/update/${student.id}`)
			.query({ confirm: true })

		expect(response.statusCode).toBe(StatusCodes.ACCEPTED)

		const updatedStudent = await manager.findOneBy(User, { id: student.id })
		expect(updatedStudent.admittedAt).not.toBeNull()
	})

	it.todo("can be accessed by permitted user and admit multiple users")
	it.todo("can be accessed by permitted user and readmit users")
	it.todo("cannot be accessed by guest users")
})
