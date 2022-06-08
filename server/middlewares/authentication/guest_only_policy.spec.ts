import { StatusCodes } from "http-status-codes"
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import type { Request, Response } from "!/types/dependent"

import GuestOnlyPolicy from "./guest_only_policy"

describe("Middleware: Authenticated Guard", () => {
	it("can allow guest users", async () => {
		const authenticatedGuard = new GuestOnlyPolicy()
		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		request.isAuthenticated = jest.fn().mockReturnValue(false)

		await authenticatedGuard.intermediate(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it.skip("can deny authenticated users", async () => {
		const authenticatedGuard = new GuestOnlyPolicy()
		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		request.isAuthenticated = jest.fn().mockReturnValue(true)

		await authenticatedGuard.intermediate(request, response, next)

		const status = response.status as jest.MockedFn<(number) => Response>
		expect(status).toHaveBeenCalled()
		expect(status.mock.calls[0]).toEqual([ StatusCodes.UNAUTHORIZED ])
		expect(response.json).toHaveBeenCalled()
	})
})
