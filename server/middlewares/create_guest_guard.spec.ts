import UserFactory from "~/factories/user"
import createGuestGuard from "./create_guest_guard"
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import type { WithPossibleUser } from "!/types"
import type { Request, Response, Send } from "express"

describe("Middleware: Guest guard", () => {
	type RequestWithPossibleUser = Request & WithPossibleUser

	it("can allow guest users", async () => {
		const runGuestGuard = createGuestGuard()
		const request  = makeRequest<RequestWithPossibleUser>()
		const { res: response, next, } = makeResponse()
		request.user = null

		await runGuestGuard(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it("can deny authenticated users", async () => {
		const user = await (new UserFactory()).insertOne()
		const runGuestGuard = createGuestGuard()
		const request  = makeRequest<RequestWithPossibleUser>()
		const { res: response, next, } = makeResponse()
		request.user = user

		await runGuestGuard(request, response, next)

		const status = response.status as jest.MockedFn<(number) => Response>
		expect(status).toHaveBeenCalled()
		expect(status.mock.calls[0]).toEqual([ 402 ])
		expect(response.json).toHaveBeenCalled()
	})
})
