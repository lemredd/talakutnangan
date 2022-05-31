import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"
import UserManager from "%/managers/user_manager"
import Database from "~/database"
import GetCreate from "./create.get"

describe("GET /api/user/create", () => {
	it("can create user", async () => {
		const manager = new UserManager()
		const getCreateRoute = new GetCreate()

		const request = makeRequest()
		const { res: response, } = makeResponse()
		await getCreateRoute.handle(request, response)

		const user = await manager.findWithID(1)
		expect(user).not.toBeNull()
		expect(response.statusCode).toBe(201)
		expect(response.end).toHaveBeenCalled()
	})
})
