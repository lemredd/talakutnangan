import { StatusCodes } from "http-status-codes"
import type { Request, Response, Send } from "express"
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import UserFactory from "~/factories/user"
import { WithPossibleUser, UserKind } from "!/types"

import AuthenticatedPageGuard from "./authenticated_page_guard"

describe("Middleware: Authorization guard", () => {
	type RequestWithPossibleUser = Request & WithPossibleUser

	it("can allow any authenticated users", async () => {
		const user = await (new UserFactory()).insertOne()
		const pageGuard = new AuthenticatedPageGuard(null)
		const request  = makeRequest<RequestWithPossibleUser>()
		const { res: response, next, } = makeResponse()
		request.user = user

		await pageGuard.intermediate(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it.skip("can allow unreachable employees only", async () => {
		const user = await (new UserFactory()).insertOne()
		const pageGuard = new AuthenticatedPageGuard(UserKind.UnreachableEmployee)
		const request  = makeRequest<RequestWithPossibleUser>()
		const { res: response, next, } = makeResponse()
		request.user = user

		await pageGuard.intermediate(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it.skip("can allow reachable employees only", async () => {
		const user = await (new UserFactory()).insertOne()
		const pageGuard = new AuthenticatedPageGuard(UserKind.ReachableEmployee)
		const request  = makeRequest<RequestWithPossibleUser>()
		const { res: response, next, } = makeResponse()
		request.user = user

		await pageGuard.intermediate(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it.skip("can allow students only", async () => {
		const user = await (new UserFactory()).insertOne()
		const pageGuard = new AuthenticatedPageGuard(UserKind.Student)
		const request  = makeRequest<RequestWithPossibleUser>()
		const { res: response, next, } = makeResponse()
		request.user = user

		await pageGuard.intermediate(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it("can deny guest users", async () => {
		const pageGuard = new AuthenticatedPageGuard(null)
		const request  = makeRequest<RequestWithPossibleUser>()
		const { res: response, next, } = makeResponse()
		request.user = null

		await pageGuard.intermediate(request, response, next)

		const status = response.status as jest.MockedFn<(number) => Response>
		expect(status).toHaveBeenCalled()
		expect(status.mock.calls[0]).toEqual([ StatusCodes.UNAUTHORIZED ])
		expect(response.json).toHaveBeenCalled()
	})
})
