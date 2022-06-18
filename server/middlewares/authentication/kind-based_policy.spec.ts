import { StatusCodes } from "http-status-codes"
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import { UserKind } from "$/types/database"
import type { MockResponse } from "!/types/test"
import type { Request } from "!/types/dependent"

import UserFactory from "~/factories/user"

import KindBasedPolicy from "./kind-based_policy"

describe("Middleware: Kind-Based Policy", () => {
	const request  = makeRequest<Request>()
	const { res: response, next, mockClear } = makeResponse()

	afterEach(() => mockClear())

	it("can allow unreachable employees only as expected", async () => {
		const user = await (new UserFactory()).beUnreachableEmployee().insertOne()
		const pageGuard = new KindBasedPolicy(UserKind.UnreachableEmployee)
		request.user = user
		request.isAuthenticated = jest.fn().mockReturnValue(true)

		await pageGuard.intermediate(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it("can allow reachable employees only as expected", async () => {
		const user = await (new UserFactory()).beReachableEmployee().insertOne()
		const pageGuard = new KindBasedPolicy(UserKind.ReachableEmployee)
		request.user = user
		request.isAuthenticated = jest.fn().mockReturnValue(true)

		await pageGuard.intermediate(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it("can allow students only as expected", async () => {
		const user = await (new UserFactory()).beStudent().insertOne()
		const pageGuard = new KindBasedPolicy(UserKind.Student)
		request.user = user
		request.isAuthenticated = jest.fn().mockReturnValue(true)

		await pageGuard.intermediate(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it("can deny students if reachable employees are expected", async () => {
		const user = await (new UserFactory()).beStudent().insertOne()
		const pageGuard = new KindBasedPolicy(UserKind.ReachableEmployee)
		request.user = user
		request.isAuthenticated = jest.fn().mockReturnValue(true)

		await pageGuard.intermediate(request, response, next)

		const mockResponse = response as unknown as MockResponse
		expect(mockResponse.status).toHaveBeenCalled()
		expect(mockResponse.status.mock.calls[0]).toEqual([ StatusCodes.UNAUTHORIZED ])
		expect(mockResponse.json).toHaveBeenCalled()
	})
})
