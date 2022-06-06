import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import UserManager from "%/managers/user_manager"

import UserFactory from "~/factories/user"

import PatchUpdateRoute, { WithUpdate } from "./update(id).patch"

describe("PATCH /api/user/update/:id", () => {
	type RequestWithUpdate = Request & WithUpdate

	it("can admit user", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).insertOne()
		const patchUpdateRoute = new PatchUpdateRoute()
		const request = makeRequest<RequestWithUpdate>()
		const { res: response } = makeResponse()
		request.params.id = String(user.id)
		request.query.confirm = "1"

		await patchUpdateRoute.handle(request, response)

		const status = response.status as jest.MockedFn<(number) => Response>
		expect(status.mock.calls[0]).toEqual([ StatusCodes.ACCEPTED ])

		const updatedUser = await manager.findWithID(user.id)
		expect(updatedUser.admittedAt).not.toBeNull()
	})

	it("cannot readmit user", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).insertOne()
		const patchUpdateRoute = new PatchUpdateRoute()
		const request = makeRequest<RequestWithUpdate>()
		const { res: response, clearMockRes } = makeResponse()
		request.params.id = String(user.id)
		request.query.confirm = "1"

		await patchUpdateRoute.handle(request, response)
		const updatedUser = await manager.findWithID(user.id)
		clearMockRes()
		await patchUpdateRoute.handle(request, response)
		const readmittedUser = await manager.findWithID(user.id)

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
