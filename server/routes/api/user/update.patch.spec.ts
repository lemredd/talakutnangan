import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import User from "!/models/user"

import Database from "~/database"
import UserFactory from "~/factories/user"

import PatchUpdateRoute, { WithUpdate } from "./update.patch"

describe("PATCH /api/user/update/:id", () => {
	type RequestWithUpdate = Request & WithUpdate

	it("can admit user", async () => {
		const manager = Database.manager
		const user = await (new UserFactory()).insertOne()
		const patchUpdateRoute = new PatchUpdateRoute()
		const request = makeRequest<RequestWithUpdate>()
		const { res: response } = makeResponse()
		request.params.id = String(user.id)
		request.query.confirm = "1"

		await patchUpdateRoute.handle(request, response)

		const status = response.status as jest.MockedFn<(number) => Response>
		expect(status.mock.calls[0]).toEqual([ StatusCodes.ACCEPTED ])

		const users = await manager.find(User)
		expect(users).toHaveLength(1)
		expect(users[0].admittedAt).not.toBeNull()
	})

	it("cannot readmit user", async () => {
		const manager = Database.manager
		const user = await (new UserFactory()).insertOne()
		const patchUpdateRoute = new PatchUpdateRoute()
		const request = makeRequest<RequestWithUpdate>()
		const { res: response, clearMockRes } = makeResponse()
		request.params.id = String(user.id)
		request.query.confirm = "1"

		await patchUpdateRoute.handle(request, response)
		const updatedUser = await manager.findOneBy(User, { id: user.id })
		clearMockRes()
		await patchUpdateRoute.handle(request, response)
		const readmittedUser = await manager.findOneBy(User, { id: user.id })

		const status = response.status as jest.MockedFn<(number) => Response>
		expect(status.mock.calls[0]).toEqual([ StatusCodes.NOT_MODIFIED ])
		expect(readmittedUser.admittedAt).toEqual(updatedUser.admittedAt)
	})

	it("cannot admit missing user", async () => {
		const patchUpdateRoute = new PatchUpdateRoute()
		const request = makeRequest<RequestWithUpdate>()
		const { res: response } = makeResponse()
		request.params.id = "1"
		request.query.confirm = "1"

		await patchUpdateRoute.handle(request, response)

		const status = response.status as jest.MockedFn<(number) => Response>
		expect(status.mock.calls[0]).toEqual([ StatusCodes.NOT_MODIFIED ])
	})
})
