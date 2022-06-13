import { StatusCodes } from "http-status-codes"
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import type { MockResponse } from "!/types/test"
import type { Request, Response } from "!/types/dependent"

import AuthenticationBasedPolicy from "./authentication-based_policy"

describe("Middleware: Authenticated-Based Policy", () => {
	it("can allow guest users if guests are expected", async () => {
		const authenticatedGuard = new AuthenticationBasedPolicy(false)
		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		request.isAuthenticated = jest.fn().mockReturnValue(false)

		await authenticatedGuard.intermediate(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it("can deny known users if guest are expected", async () => {
		const authenticatedGuard = new AuthenticationBasedPolicy(false)
		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		request.isAuthenticated = jest.fn().mockReturnValue(true)

		await authenticatedGuard.intermediate(request, response, next)

		const mockResponse = <MockResponse><unknown>response
		expect(mockResponse.status).toHaveBeenCalled()
		expect(mockResponse.status.mock.calls[0]).toEqual([ StatusCodes.UNAUTHORIZED ])
		expect(mockResponse.json).toHaveBeenCalled()
	})

	it("can allow known users if known are expected", async () => {
		const authenticatedGuard = new AuthenticationBasedPolicy(true)
		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		request.isAuthenticated = jest.fn().mockReturnValue(true)

		await authenticatedGuard.intermediate(request, response, next)

		expect(next).toHaveBeenCalled()
	})


	it("can deny guest users if known are expected", async () => {
		const authenticatedGuard = new AuthenticationBasedPolicy(true)
		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		request.isAuthenticated = jest.fn().mockReturnValue(false)

		await authenticatedGuard.intermediate(request, response, next)

		const mockResponse = <MockResponse><unknown>response
		expect(mockResponse.status).toHaveBeenCalled()
		expect(mockResponse.status.mock.calls[0]).toEqual([ StatusCodes.UNAUTHORIZED ])
		expect(mockResponse.json).toHaveBeenCalled()
	})
})