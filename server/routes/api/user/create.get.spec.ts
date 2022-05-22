import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"
import makeGetCreateRoute from "./create.get"
import Database from "~/database"
import User from "!/models/user"

describe("GET /api/user/create", () => {
	it("can create user", async () => {
		const manager = Database.manager
		const getCreateRoute = makeGetCreateRoute(manager)

		const request = makeRequest()
		const { res: response, } = makeResponse()
		await getCreateRoute(request, response)

		const users = await manager.find(User)
		expect(users).toHaveLength(1)
		expect(response.statusCode).toBe(201)
		expect(response.end).toHaveBeenCalled()
	})
})
