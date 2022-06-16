import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import { Request } from "!/types/dependent"
import { PageRequest } from "!/types/hybrid"
import type { Serializable } from "%/types/independent"

import Policy from "!/bases/policy"
import UserFactory from "~/factories/user"

import PageMiddleware from "./page_middleware"

describe("Back-end: Base PageMiddleware", () => {
	it("can make handlers", () => {
		class PolicyA extends Policy {
			mayAllow(): boolean { return true }
		}

		class PageMiddlewareA extends PageMiddleware {
			get filePath(): string { return __filename }

			get policy(): Policy { return new PolicyA() }
		}

		const handlers = (new PageMiddlewareA()).handlers

		expect(handlers.middlewares).toHaveLength(2)
		expect(handlers.controller.name).toBe("bound intermediate")
		expect(handlers.postJobs).toHaveLength(0)
		expect(handlers.endHandler).toBeNull()
	})

	it("can run policy", async () => {
		class PolicyB extends Policy {
			mayAllow(): boolean { return true }
		}

		class PageMiddlewareB extends PageMiddleware {
			get filePath(): string { return __filename }

			get policy(): Policy { return new PolicyB() }
		}

		const enhancer = new PageMiddlewareB()
		const request  = makeRequest<PageRequest>()
		const { res: response, next, } = makeResponse()
		request.isAuthenticated = jest.fn(() => false)

		await enhancer.intermediate(request, response, next)

		expect(next).toHaveBeenCalled()
	})

	it("can pass page props for guests", async () => {
		class PageMiddlewareC extends PageMiddleware {
			get filePath(): string { return __filename }

			get policy(): null { return null }

			getPageProps(request: Request): Serializable {
				return { hello: "world" }
			}
		}

		const enhancer = new PageMiddlewareC()
		const request  = makeRequest<PageRequest>()
		const { res: response, next, } = makeResponse()
		request.isAuthenticated = jest.fn(() => false)

		await enhancer.intermediate(request, response, next)

		expect(request.pageProps).toStrictEqual({
			userProfile: null,
			hello: "world"
		})
	})

	it("can pass page props for known", async () => {
		class PageMiddlewareD extends PageMiddleware {
			get filePath(): string { return __filename }

			get policy(): null { return null }

			getPageProps(request: Request): Serializable {
				return { hello: "world" }
			}
		}

		const enhancer = new PageMiddlewareD()
		const request  = makeRequest<PageRequest>()
		const { res: response, next, } = makeResponse()
		request.isAuthenticated = jest.fn(() => true)
		request.user = await (new UserFactory()).makeOne()

		await enhancer.intermediate(request, response, next)

		expect(request.pageProps).toStrictEqual({
			userProfile: request.user,
			hello: "world"
		})
	})
})
