import { StatusCodes } from "http-status-codes"
import type { Request, Response, Send } from "express"
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import UserFactory from "~/factories/user"
import createAuthorizationGuard from "./create_authorization_guard"
import { WithPossibleUser, UserKind } from "!/types"

describe("Middleware: Authorization guard", () => {
	type RequestWithPossibleUser = Request & WithPossibleUser

	it("can allow any authenticated users", async () => {
		const user = await (new UserFactory()).insertOne()
		const runGuestGuard = createAuthorizationGuard(null)
		const request  = makeRequest<RequestWithPossibleUser>()
		const { res: response, next, } = makeResponse()
		request.user = user

		await runGuestGuard(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it.skip("can allow unreachable employees only", async () => {
		const user = await (new UserFactory()).insertOne()
		const runGuestGuard = createAuthorizationGuard(UserKind.UnreachableEmployee)
		const request  = makeRequest<RequestWithPossibleUser>()
		const { res: response, next, } = makeResponse()
		request.user = user

		await runGuestGuard(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it.skip("can allow reachable employees only", async () => {
		const user = await (new UserFactory()).insertOne()
		const runGuestGuard = createAuthorizationGuard(UserKind.ReachableEmployee)
		const request  = makeRequest<RequestWithPossibleUser>()
		const { res: response, next, } = makeResponse()
		request.user = user

		await runGuestGuard(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it.skip("can allow students only", async () => {
		const user = await (new UserFactory()).insertOne()
		const runGuestGuard = createAuthorizationGuard(UserKind.Student)
		const request  = makeRequest<RequestWithPossibleUser>()
		const { res: response, next, } = makeResponse()
		request.user = user

		await runGuestGuard(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it("can deny guest users", async () => {
		const runGuestGuard = createAuthorizationGuard(null)
		const request  = makeRequest<RequestWithPossibleUser>()
		const { res: response, next, } = makeResponse()
		request.user = null

		await runGuestGuard(request, response, next)

		const status = response.status as jest.MockedFn<(number) => Response>
		expect(status).toHaveBeenCalled()
		expect(status.mock.calls[0]).toEqual([ StatusCodes.UNAUTHORIZED ])
		expect(response.json).toHaveBeenCalled()
	})
})
