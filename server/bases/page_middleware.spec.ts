import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import Policy from "!/bases/policy"
import { Request, Response, NextFunction } from "!/types/dependent"

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

		expect(handlers.middlewares).toHaveLength(0)
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

		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		await enhancer.intermediate(request, response, next)

		expect(next).toHaveBeenCalled()
	})
})
