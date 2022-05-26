import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"
import { StatusCodes } from "http-status-codes"
import type { Request, Response, Send } from "express"

import UserFactory from "~/factories/user"
import createGuestGuard from "./create_guest_guard"

import type { WithPossibleUser } from "!/types"

describe("Middleware: Guest guard", () => {
	type RequestWithPossibleUser = Request & WithPossibleUser

	it("can allow guest users", async () => {
		const runGuestGuard = createGuestGuard()
		const request  = makeRequest<RequestWithPossibleUser>()
		const { res: response, next, } = makeResponse()
		request.isAuthenticated = jest.fn().mockReturnValue(false)

		await runGuestGuard(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it("can deny authenticated users", async () => {
		const user = await (new UserFactory()).insertOne()
		const runGuestGuard = createGuestGuard()
		const request  = makeRequest<RequestWithPossibleUser>()
		const { res: response, next, } = makeResponse()
		request.isAuthenticated = jest.fn().mockReturnValue(true)

		await runGuestGuard(request, response, next)

		const status = response.status as jest.MockedFn<(number) => Response>
		expect(status).toHaveBeenCalled()
		expect(status.mock.calls[0]).toEqual([ StatusCodes.UNAUTHORIZED ])
		expect(response.json).toHaveBeenCalled()
	})
})
