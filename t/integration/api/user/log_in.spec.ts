import { StatusCodes } from "http-status-codes"

import App from "~/app"
import UserFactory from "~/factories/user"

describe("POST /api/user/log_in", () => {
	it("can be accessed by guest and request with existing credentials", async () => {
		const user = await (new UserFactory()).insertOne()

		const response = await App.request
			.post("/api/user/log_in")
			.send({
				email: user.email,
				password: user.password
			})

		expect(response.statusCode).toBe(StatusCodes.OK)
		expect(response.body).toHaveProperty("token")
	})

	it("can be accessed by guest and request with non-existing credentials", async () => {
		const response = await App.request
			.post("/api/user/log_in")
			.send({
				email: "sample@gmail.com",
				password: "12345678"
			})

		expect(response.statusCode).toBe(StatusCodes.MOVED_TEMPORARILY)
	})

	it("cannot be accessed by authenticated users", async () => {
		const user = await (new UserFactory()).insertOne()

		const preresponse = await App.request
			.post("/api/user/log_in")
			.send({
				email: user.email,
				password: user.password
			})
		const response = await App.request
			.post("/api/user/log_in")
			.set("Cookie", preresponse.headers["set-cookie"])
			.send({
				email: user.email,
				password: user.password
			})

		expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
		expect(response.body).toHaveProperty("errors")
	})
})
