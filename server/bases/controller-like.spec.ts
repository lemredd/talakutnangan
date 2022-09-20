import type { EndHandler } from "!/types/hybrid"
import type { RouteInformation } from "$/types/server"
import type { OptionalMiddleware } from "!/types/independent"
import type { Request, Response, NextFunction } from "!/types/dependent"

import Policy from "!/bases/policy"
import Middleware from "!/bases/middleware"
import Validation from "!/bases/validation"
import endRequest from "!/helpers/end_request"
import MockRequester from "~/setups/mock_requester"

import ControllerLike from "./controller-like"

abstract class BaseTestController extends ControllerLike {
	get filePath(): string { return __filename }

	get endHandler(): EndHandler { return endRequest }

	get policy(): Policy | null { return null }

	get bodyParser(): OptionalMiddleware { return null }

	get validations(): Validation[] { return [] }
}

describe("Back-end Base: ControllerLike Non-Request", () => {
	it("can make handlers", () => {
		class ControllerA extends BaseTestController {
			async intermediate(request: Request, unusedResponse: Response, next: NextFunction)
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
			get filePath(): string { return `${this.root}/routes/a/b/index.get.ts` }

			async intermediate(request: Request, unusedResponse: Response, next: NextFunction)
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
})

describe("Back-end Base: ControllerLike Middlewares", () => {
	const requester = new MockRequester()

	it("can prepend middleware", async () => {
		const middlewareFunction = jest.fn()

		class MiddlewareA extends Middleware {
			intermediate(request: Request, unusedResponse: Response, next: NextFunction): Promise<void> {
				middlewareFunction()
				next()
				return Promise.resolve()
			}
		}

		class ControllerD extends BaseTestController {
			async intermediate(request: Request, unusedResponse: Response, next: NextFunction)
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
		const { middlewares, postJobs } = handlers
		const targetMiddleware = middlewares[middlewares.length - 1]!

		await requester.runMiddleware(targetMiddleware.intermediate.bind(targetMiddleware))

		expect(postJobs).toHaveLength(0)
		expect(middlewares).toHaveLength(3)
		requester.expectSuccess()
		expect(middlewareFunction).toHaveBeenCalled()
	})

	it("can append post jobs", async () => {
		const middlewareFunction = jest.fn()

		class MiddlewareB extends Middleware {
			intermediate(request: Request, unusedResponse: Response, next: NextFunction): Promise<void> {
				middlewareFunction()
				next()
				return Promise.resolve()
			}
		}

		class ControllerE extends BaseTestController {
			async intermediate(request: Request, unusedResponse: Response, next: NextFunction)
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
		const { middlewares, postJobs } = handlers
		const targetPostJob = postJobs[postJobs.length - 1]!

		await requester.runMiddleware(targetPostJob.intermediate.bind(targetPostJob))

		expect(middlewares).toHaveLength(2)
		expect(postJobs).toHaveLength(1)
		requester.expectSuccess()
		expect(middlewareFunction).toHaveBeenCalled()
	})

	it("can retain context upon passing", async () => {
		const targetMessage = "Hello world"
		const handleFunction = jest.fn()

		class ControllerF extends BaseTestController {
			private message = targetMessage

			async intermediate(request: Request, unusedResponse: Response, next: NextFunction)
				: Promise<void> {
				handleFunction(this.message)
			}
		}
		const controller = new ControllerF()

		await requester.runMiddleware(controller.intermediate.bind(controller))

		expect(handleFunction.mock.calls[0]).toEqual([ targetMessage ])
	})

	it("can use policy", async () => {
		const middlewareFunction = jest.fn()

		class PolicyA extends Policy {
			async authorize(request: Request): Promise<void> {
				middlewareFunction()
				return
			}
		}

		class ControllerG extends BaseTestController {
			async intermediate(request: Request, unusedResponse: Response, next: NextFunction)
				: Promise<void> {
				return Promise.resolve()
			}

			get policy(): Policy | null { return new PolicyA() }
		}

		const handlers = (new ControllerG()).handlers
		const { middlewares } = handlers
		const targetMiddleware = middlewares[0]!

		await requester.runMiddleware(targetMiddleware.intermediate.bind(targetMiddleware))

		expect(middlewareFunction).toHaveBeenCalled()
	})

	it("can use body parser", async () => {
		const middlewareFunction = jest.fn()

		class BodyParserA extends Middleware {
			async intermediate(request: Request, unusedResponse: Response, next: NextFunction)
				: Promise<void> {
				middlewareFunction()
				return Promise.resolve()
			}
		}

		class ControllerH extends BaseTestController {
			async intermediate(request: Request, unusedResponse: Response, next: NextFunction)
				: Promise<void> {
				return Promise.resolve()
			}

			get bodyParser(): OptionalMiddleware { return new BodyParserA() }
		}

		const handlers = (new ControllerH()).handlers
		const { middlewares } = handlers
		const targetMiddleware = middlewares[1]!

		await requester.runMiddleware(targetMiddleware.intermediate.bind(targetMiddleware))

		expect(middlewareFunction).toHaveBeenCalled()
	})

	it("can use validations", async () => {
		const middlewareFunction = jest.fn()

		class ValidationA extends Validation {
			getSubject(request: Request): object {
				middlewareFunction()
				return {}
			}
		}

		class ControllerI extends BaseTestController {
			async intermediate(request: Request, unusedResponse: Response, next: NextFunction)
				: Promise<void> {
				return Promise.resolve()
			}

			get validations(): Validation[] { return [ new ValidationA(() => ({})) ] }
		}

		const handlers = (new ControllerI()).handlers
		const { middlewares } = handlers
		const targetMiddleware = middlewares[2]!

		await requester.runMiddleware(targetMiddleware.intermediate.bind(targetMiddleware))

		expect(middlewareFunction).toHaveBeenCalled()
	})

	it("can use post parser middlewares", async () => {
		const middlewareFunction = jest.fn()

		class PostBodyParserA extends Middleware {
			async intermediate(request: Request, unusedResponse: Response, next: NextFunction)
				: Promise<void> {
				middlewareFunction()
				return Promise.resolve()
			}
		}

		class ControllerJ extends BaseTestController {
			async intermediate(request: Request, unusedResponse: Response, next: NextFunction)
				: Promise<void> {
				return Promise.resolve()
			}

			get postParseMiddlewares(): OptionalMiddleware[] {
				return [ new PostBodyParserA() ]
			}
		}

		const handlers = (new ControllerJ()).handlers
		const { middlewares } = handlers
		const targetMiddleware = middlewares[2]!

		await requester.runMiddleware(targetMiddleware.intermediate.bind(targetMiddleware))

		expect(middlewareFunction).toHaveBeenCalled()
	})

	it("can use post validation middlewares", async () => {
		const middlewareFunction = jest.fn()

		class PostValidationA extends Middleware {
			async intermediate(request: Request, unusedResponse: Response, next: NextFunction)
				: Promise<void> {
				middlewareFunction()
				return Promise.resolve()
			}
		}

		class ControllerJ extends BaseTestController {
			async intermediate(request: Request, unusedResponse: Response, next: NextFunction)
				: Promise<void> {
				return Promise.resolve()
			}

			get postValidationMiddlewares(): OptionalMiddleware[] {
				return [ new PostValidationA() ]
			}
		}

		const handlers = (new ControllerJ()).handlers
		const { middlewares } = handlers
		const targetMiddleware = middlewares[2]!

		await requester.runMiddleware(targetMiddleware.intermediate.bind(targetMiddleware))

		expect(middlewareFunction).toHaveBeenCalled()
	})
})
