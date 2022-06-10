import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import Middleware from "!/bases/middleware"
import { Request, Response, NextFunction } from "!/types/dependent"

import Enhancer from "./enhancer"

describe("Back-end: Base Enhancer", () => {
	it("can make handlers", () => {
		class MiddlewareA extends Middleware {
			intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
				return Promise.resolve()
			}
		}

		class EnhancerA extends Enhancer {
			get filePath(): string { return __filename }

			get middleware(): Middleware { return new MiddlewareA() }

			handle(request: Request, response: Response): Promise<void> {
				return Promise.resolve()
			}
		}

		const handlers = (new EnhancerA()).handlers

		expect(handlers.middlewares).toHaveLength(0)
		expect(handlers.controller.name).toBe("bound intermediate")
		expect(handlers.postJobs).toHaveLength(0)
		expect(handlers.endHandler).toBeNull()
	})

	it("can run middleware", async () => {
		const middlewareFunction = jest.fn()

		class MiddlewareB extends Middleware {
			async intermediate(request: Request, response: Response, next: NextFunction)
				: Promise<void> {
				middlewareFunction()
				next()
			}
		}

		class EnhancerB extends Enhancer {
			get filePath(): string { return __filename }

			get middleware(): Middleware { return new MiddlewareB() }

			handle(request: Request, response: Response): Promise<void> {
				return Promise.resolve()
			}
		}

		const enhancer = new EnhancerB()

		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		await enhancer.intermediate(request, response, next)

		expect(middlewareFunction).toHaveBeenCalled()
		expect(next).toHaveBeenCalled()
	})
})
