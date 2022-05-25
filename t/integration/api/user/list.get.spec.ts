import { StatusCodes } from "http-status-codes"

import App from "~/app"
import UserFactory from "~/factories/user"

describe("POST /api/user/list", () => {
	it("can be accessed by permitted user and get unadmitted users", async () => {
		const user = await (new UserFactory()).verified().insertOne()
		console.log(user)
		const response = await App.request
			.get("/api/user/list")
			.query({ criteria: "unadmitted" })

		expect(response.statusCode).toBe(StatusCodes.OK)
		expect(response.body).toStrictEqual([
			user
		])
	})

	it.todo("cannot be accessed by guest users")
})
