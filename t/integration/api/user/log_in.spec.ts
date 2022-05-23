import request from "supertest"
import { StatusCodes } from "http-status-codes"

import User from "!/models/user"
import createAppHandler from "!/app/create_handler"

import Database from "~/database"
import UserFactory from "~/factories/user"

describe("Integration: POST /api/user/log_in", async () => {
	let app

	it("can be accessed by guest and request with existing credentials", async () => {
		const manager = Database.manager
		app = await createAppHandler(manager)
		const user = await (new UserFactory()).insertOne()

		const response = await request(app)
			.post("/api/user/log_in")
			.send({
				email: user.email,
				password: user.password
			})

		expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
	})

	it("can be accessed by guest and request with non-existing credentials", async () => {
		const response = await request(app)
			.post("/api/user/log_in")
			.send({
				email: "sample@gmail.com",
				password: "12345678"
			})

		expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
	})
})
