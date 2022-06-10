import { StatusCodes } from "http-status-codes"
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import { Response } from "!/types/dependent"

import Policy from "./policy"

describe("Back-end: Base Policy", () => {
	it("can allow user", async () => {
		class PolicyA extends Policy {
			mayAllow(): boolean { return true }
		}
		const policy = new PolicyA()

		const request  = makeRequest()
		const { res: response, next, } = makeResponse()
		await policy.intermediate(request, response, next)
		expect(next).toHaveBeenCalled()
	})

	it("can deny user", async () => {
		class PolicyB extends Policy {
			mayAllow(): boolean { return false }
		}
		const policy = new PolicyB()

		const request  = makeRequest()
		const { res: response, next, } = makeResponse()
		await policy.intermediate(request, response, next)

		const status = response.status as jest.MockedFn<(number) => Response>
		expect(status.mock.calls[0]).toEqual([ StatusCodes.UNAUTHORIZED ])
	})
})
