import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import Policy from "!/bases/policy"
import Middleware from "!/bases/middleware"
import Validation from "!/bases/validation"
import { EndHandler } from "!/types/hybrid"
import endRequest from "!/helpers/end_request"
import { Request, Response, NextFunction } from "!/types/dependent"
import { RouteInformation, OptionalMiddleware } from "$/types/independent"

import ControllerLike from "./controller-like"

describe("Back-end: Base ControllerLike", () => {
	abstract class BaseTestController extends ControllerLike {
		get filePath(): string { return __filename }

		get endHandler(): EndHandler { return endRequest }

		get policy(): Policy | null { return null }

		get bodyParser(): OptionalMiddleware { return null }

		get validations(): Validation[] { return [] }
	}

	it("can make handlers", () => {
		class ControllerA extends BaseTestController {
			async intermediate(request: Request, response: Response, next: NextFunction)
				: Promise<void> {
				return Promise.resolve()
			}
		}

		const handlers = (new ControllerA()).handlers

		expect(handlers.middlewares).toHaveLength(2)
		expect(handlers.controller.name).toBe("bound intermediate")
		expect(handlers.postJobs).toHaveLength(0)
		expect(handlers.endHandler).toStrictEqual(endRequest)
	})

	it("can make route information", () => {
		class ControllerB extends BaseTestController {
			get filePath(): string { return `${this.root}/server/app/routes/a/b/index.get.ts` }

			async intermediate(request: Request, response: Response, next: NextFunction)
				: Promise<void> {
				return Promise.resolve()
			}
		}

		const routeInformation = (new ControllerB()).routeInformation

		expect(routeInformation).toStrictEqual(<RouteInformation>{
			method: "get",
			path: "/a/b",
			purpose: "enhancer",
			description: null
		})
	})

	it("can prepend middleware", () => {
		const middlewareFunction = jest.fn()

		class MiddlewareA extends Middleware {
			intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
				middlewareFunction()
				return Promise.resolve()
			}
		}

		class ControllerD extends BaseTestController {
			async intermediate(request: Request, response: Response, next: NextFunction)
				: Promise<void> {
				return Promise.resolve()
			}

			get middlewares(): OptionalMiddleware[] {
				return [
					...super.middlewares,
					new MiddlewareA()
				]
			}
		}

		const handlers = (new ControllerD()).handlers

		expect(handlers.middlewares).toHaveLength(3)
		expect(handlers.postJobs).toHaveLength(0)

		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		handlers.middlewares[handlers.middlewares.length - 1]!.intermediate(request, response, next)
		expect(middlewareFunction).toHaveBeenCalled()
	})

	it("can append post jobs", () => {
		const middlewareFunction = jest.fn()

		class MiddlewareB extends Middleware {
			intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
				middlewareFunction()
				return Promise.resolve()
			}
		}

		class ControllerE extends BaseTestController {
			async intermediate(request: Request, response: Response, next: NextFunction)
				: Promise<void> {
				return Promise.resolve()
			}

			get postJobs(): OptionalMiddleware[] {
				return [
					...super.postJobs,
					new MiddlewareB()
				]
			}
		}

		const handlers = (new ControllerE()).handlers

		expect(handlers.middlewares).toHaveLength(2)
		expect(handlers.postJobs).toHaveLength(1)

		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		handlers.postJobs[0]!.intermediate(request, response, next)
		expect(middlewareFunction).toHaveBeenCalled()
	})

	it("can retain context upon passing", async () => {
		const targetMessage = "Hello world"
		const handleFunction = jest.fn()

		class ControllerF extends BaseTestController {
			private message = targetMessage

			async intermediate(request: Request, response: Response, next: NextFunction)
				: Promise<void> {
				handleFunction(this.message)
			}
		}
		const controller = new ControllerF()
		const request  = makeRequest<Request>()
		const { res: response, next } = makeResponse()

		await controller.intermediate(request, response, next)

		expect(handleFunction.mock.calls[0]).toEqual([ targetMessage ])
	})

	it("can use policy", () => {
		const middlewareFunction = jest.fn()

		class PolicyA extends Policy {
			mayAllow(request: Request): boolean {
				middlewareFunction()
				return true
			}
		}

		class ControllerG extends BaseTestController {
			async intermediate(request: Request, response: Response, next: NextFunction)
				: Promise<void> {
				return Promise.resolve()
			}

			get policy(): Policy | null { return new PolicyA() }
		}

		const handlers = (new ControllerG()).handlers

		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		handlers.middlewares[0]!.intermediate(request, response, next)
		expect(middlewareFunction).toHaveBeenCalled()
	})

	it("can use body parser", () => {
		const middlewareFunction = jest.fn()

		class BodyParserA extends Middleware {
			async intermediate(request: Request, response: Response, next: NextFunction)
				: Promise<void> {
				middlewareFunction()
				return Promise.resolve()
			}
		}

		class ControllerH extends BaseTestController {
			async intermediate(request: Request, response: Response, next: NextFunction)
				: Promise<void> {
				return Promise.resolve()
			}

			get bodyParser(): OptionalMiddleware { return new BodyParserA() }
		}

		const handlers = (new ControllerH()).handlers

		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		handlers.middlewares[1]!.intermediate(request, response, next)
		expect(middlewareFunction).toHaveBeenCalled()
	})

	it("can use validations", () => {
		const middlewareFunction = jest.fn()

		class ValidationA extends Validation {
			getSubject(request: Request): object {
				middlewareFunction()
				return {}
			}
		}

		class ControllerI extends BaseTestController {
			async intermediate(request: Request, response: Response, next: NextFunction)
				: Promise<void> {
				return Promise.resolve()
			}

			get validations(): Validation[] { return [ new ValidationA({}) ] }
		}

		const handlers = (new ControllerI()).handlers

		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		handlers.middlewares[2]!.intermediate(request, response, next)
		expect(middlewareFunction).toHaveBeenCalled()
	})
})
