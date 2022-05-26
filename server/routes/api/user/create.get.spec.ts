import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"
import User from "!/models/user"
import Database from "~/database"
import GetCreate from "./create.get"

describe("GET /api/user/create", () => {
	it("can create user", async () => {
		const manager = Database.manager
		const getCreateRoute = new GetCreate()

		const request = makeRequest()
		const { res: response, } = makeResponse()
		await getCreateRoute.handle(request, response)

		const users = await manager.find(User)
		expect(users).toHaveLength(1)
		expect(response.statusCode).toBe(201)
		expect(response.end).toHaveBeenCalled()
	})
})
