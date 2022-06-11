import { StatusCodes } from "http-status-codes"
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import { UserKind } from "%/types"
import type { Request, Response } from "!/types/dependent"

import UserFactory from "~/factories/user"

import KindBasedPolicy from "./kind-based_policy"

describe("Middleware: Kind-Based Policy", () => {
	it("can allow unreachable employees only as expected", async () => {
		const user = await (new UserFactory()).beUnreachableEmployee().insertOne()
		const pageGuard = new KindBasedPolicy(UserKind.UnreachableEmployee)
		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		request.user = user
		request.isAuthenticated = jest.fn().mockReturnValue(true)

		await pageGuard.intermediate(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it("can allow reachable employees only as expected", async () => {
		const user = await (new UserFactory()).beReachableEmployee().insertOne()
		const pageGuard = new KindBasedPolicy(UserKind.ReachableEmployee)
		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		request.user = user
		request.isAuthenticated = jest.fn().mockReturnValue(true)

		await pageGuard.intermediate(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it("can allow students only as expected", async () => {
		const user = await (new UserFactory()).beStudent().insertOne()
		const pageGuard = new KindBasedPolicy(UserKind.Student)
		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		request.user = user
		request.isAuthenticated = jest.fn().mockReturnValue(true)

		await pageGuard.intermediate(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it("can deny students if reachable employees are expected", async () => {
		const user = await (new UserFactory()).beStudent().insertOne()
		const pageGuard = new KindBasedPolicy(UserKind.ReachableEmployee)
		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		request.user = user
		request.isAuthenticated = jest.fn().mockReturnValue(true)

		await pageGuard.intermediate(request, response, next)

		const status = response.status as jest.MockedFn<(number) => Response>
		expect(status).toHaveBeenCalled()
		expect(status.mock.calls[0]).toEqual([ StatusCodes.UNAUTHORIZED ])
		expect(response.json).toHaveBeenCalled()
	})
})
