import { StatusCodes } from "http-status-codes"
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import { Request } from "!/types/dependent"
import { MockResponse } from "!/types/test"

import Policy from "./policy"

describe("Back-end: Base Policy", () => {
	it("can allow user", async () => {
		class PolicyA extends Policy {
			mayAllow(): boolean { return true }
		}
		const policy = new PolicyA()

		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		await policy.intermediate(request, response, next)
		expect(next).toHaveBeenCalled()
	})

	it("can deny user", async () => {
		class PolicyB extends Policy {
			mayAllow(): boolean { return false }
		}
		const policy = new PolicyB()

		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		await policy.intermediate(request, response, next)

		const mockResponse = <MockResponse><unknown>response
		expect(mockResponse.status).toHaveBeenCalled()
		expect(mockResponse.status.mock.calls[0]).toEqual([ StatusCodes.UNAUTHORIZED ])
	})
})
