import { StatusCodes } from "http-status-codes"
import type { Request, Response } from "!/types/dependent"
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import type { WithPossibleUser } from "!/types"
import GuestPageGuard from "./guest_page_guard"

describe("Middleware: Authenticated Guard", () => {
	type RequestWithPossibleUser = Request & WithPossibleUser

	it("can allow guest users", () => {
		const authenticatedGuard = new GuestPageGuard()
		const request  = makeRequest<RequestWithPossibleUser>()
		const { res: response, next, } = makeResponse()
		request.isAuthenticated = jest.fn().mockReturnValue(false)

		authenticatedGuard.generateHandlers()[0](request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it.skip("can deny authenticated users", () => {
		const authenticatedGuard = new GuestPageGuard()
		const request  = makeRequest<RequestWithPossibleUser>()
		const { res: response, next, } = makeResponse()
		request.isAuthenticated = jest.fn().mockReturnValue(true)

		authenticatedGuard.generateHandlers()[0](request, response, next)

		const status = response.status as jest.MockedFn<(number) => Response>
		expect(status).toHaveBeenCalled()
		expect(status.mock.calls[0]).toEqual([ StatusCodes.UNAUTHORIZED ])
		expect(response.json).toHaveBeenCalled()
	})
})
