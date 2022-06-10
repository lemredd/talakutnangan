import { StatusCodes } from "http-status-codes"
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import { UserKind } from "%/types"
import type { Request, Response } from "!/types/dependent"

import UserFactory from "~/factories/user"

import KindBasedPolicy from "./kind-based_policy"

describe("Middleware: Kind-Based Policy", () => {
	it("can allow any authenticated users", async () => {
		const user = await (new UserFactory()).insertOne()
		const pageGuard = new KindBasedPolicy(null)
		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		request.user = user
		request.isAuthenticated = jest.fn().mockReturnValue(true)

		await pageGuard.intermediate(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it.skip("can allow unreachable employees only", async () => {
		const user = await (new UserFactory()).insertOne()
		const pageGuard = new KindBasedPolicy(UserKind.UnreachableEmployee)
		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		request.user = user
		request.isAuthenticated = jest.fn().mockReturnValue(true)

		await pageGuard.intermediate(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it.skip("can allow reachable employees only", async () => {
		const user = await (new UserFactory()).insertOne()
		const pageGuard = new KindBasedPolicy(UserKind.ReachableEmployee)
		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		request.user = user
		request.isAuthenticated = jest.fn().mockReturnValue(true)

		await pageGuard.intermediate(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it.skip("can allow students only", async () => {
		const user = await (new UserFactory()).insertOne()
		const pageGuard = new KindBasedPolicy(UserKind.Student)
		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		request.user = user
		request.isAuthenticated = jest.fn().mockReturnValue(true)

		await pageGuard.intermediate(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it("can deny guest users", async () => {
		const pageGuard = new KindBasedPolicy(null)
		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		request.user = null
		request.isAuthenticated = jest.fn().mockReturnValue(false)

		await pageGuard.intermediate(request, response, next)

		const status = response.status as jest.MockedFn<(number) => Response>
		expect(status).toHaveBeenCalled()
		expect(status.mock.calls[0]).toEqual([ StatusCodes.UNAUTHORIZED ])
		expect(response.json).toHaveBeenCalled()
	})
})
