import { Not } from "typeorm"
import { Request, Response } from "express"
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import User from "!/models/user"

import Database from "~/database"
import UserFactory from "~/factories/user"

import makePatchUpdateRoute, { WithUpdate } from "./update.patch"
import { read } from "fs"

describe("PATCH /api/user/update/:id", () => {
	type RequestWithUpdate = Request & WithUpdate

	it("can admit user", async () => {
		const manager = Database.manager
		const user = await (new UserFactory()).insertOne()
		const patchUpdateRoute = makePatchUpdateRoute(manager)
		const request = makeRequest<RequestWithUpdate>()
		const { res: response, } = makeResponse()
		request.params.id = String(user.id)
		request.query.confirm = "1"

		await patchUpdateRoute(request, response)

		const status = response.status as jest.MockedFn<(number) => Response>
		expect(status.mock.calls[0]).toEqual([ 202 ])

		const users = await manager.find(User)
		expect(users).toHaveLength(1)
		expect(users[0].admitted_at).not.toBeNull()
	})

	it("cannot readmit user", async () => {
		const manager = Database.manager
		const user = await (new UserFactory()).insertOne()
		const patchUpdateRoute = makePatchUpdateRoute(manager)
		const request = makeRequest<RequestWithUpdate>()
		const { res: response, clearMockRes } = makeResponse()
		request.params.id = String(user.id)
		request.query.confirm = "1"

		await patchUpdateRoute(request, response)
		const updatedUser = await manager.findOneBy(User, { id: user.id })
		clearMockRes()
		await patchUpdateRoute(request, response)
		const readmittedUser = await manager.findOneBy(User, { id: user.id })

		const status = response.status as jest.MockedFn<(number) => Response>
		expect(status.mock.calls[0]).toEqual([ 304 ])
		expect(readmittedUser.admitted_at).toEqual(updatedUser.admitted_at)
	})

	it("cannot admit missing user", async () => {
		const manager = Database.manager
		const patchUpdateRoute = makePatchUpdateRoute(manager)
		const request = makeRequest<RequestWithUpdate>()
		const { res: response, } = makeResponse()
		request.params.id = "1"
		request.query.confirm = "1"

		await patchUpdateRoute(request, response)

		const status = response.status as jest.MockedFn<(number) => Response>
		expect(status.mock.calls[0]).toEqual([ 304 ])
	})
	it("cannot admit missing user", async () => {
		const manager = Database.manager
		const patchUpdateRoute = makePatchUpdateRoute(manager)
		const request = makeRequest<RequestWithUpdate>()
		const { res: response, } = makeResponse()
		request.params.id = "1"
		request.query.confirm = "1"

		await patchUpdateRoute(request, response)

		const status = response.status as jest.MockedFn<(number) => Response>
		expect(status.mock.calls[0]).toEqual([ 304 ])
	})
})
