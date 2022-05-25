import { Request, Response } from "express"
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import Database from "~/database"
import Middleware from "!/helpers/middleware"

import Controller from "./controller"

describe("Back-end: Base Controller", () => {
	it("can create simple route", () => {
		class ControllerA extends Controller {
			private handle(request: Request, response: Response): void {}
		}
		const targetURL = "/"

		const { URL, handlers } = (new ControllerA(targetURL)).generateRoute()

		expect(URL).toBe(targetURL)
		expect(handlers).toHaveLength(1)
	})

	it("can override route", () => {
		class ControllerB extends Controller {
			private handle(request: Request, response: Response): void {}
		}
		const targetURL = "/a/b"

		const { URL, handlers } = (new ControllerB(targetURL, true)).generateRoute("/c")

		expect(URL).toBe(targetURL)
	})

	it("can prefix route", () => {
		class ControllerC extends Controller {
			private handle(request: Request, response: Response): void {}
		}
		const targetURL = "/c/d"

		const { URL, handlers } = (new ControllerC(targetURL, false)).generateRoute("/a/b")

		expect(URL).toBe(`/a/b/${targetURL}`)
	})

	it("can prepend middleware", () => {
		const middlewareFunction = jest.fn()

		class MiddlewareA extends Middleware {
			private intermediate(request: Request, response: Response, next: NextFunction): void {
				middlewareFunction()
			}
		}

		class ControllerD extends Controller {
			constructor(URL: string, overridesPrefix: boolean = false) {
				super(URL, overridesPrefix)

				this.prependMiddleware(new MiddlewareA())
			}

			private handle(request: Request, response: Response): void {}
		}
		const targetURL = "/"

		const { URL, handlers } = (new ControllerD(targetURL)).generateRoute()

		expect(handlers).toHaveLength(2)

		const request  = makeRequest()
		const { res: response, next, } = makeResponse()
		handlers[0](request, response, next)
		expect(middlewareFunction).toHaveBeenCalled()
	})

	it("can append middleware", () => {
		const middlewareFunction = jest.fn()

		class MiddlewareB extends Middleware {
			private intermediate(request: Request, response: Response, next: NextFunction): void {
				middlewareFunction()
			}
		}

		class ControllerE extends Controller {
			constructor(URL: string, overridesPrefix: boolean = false) {
				super(URL, overridesPrefix)

				this.appendMiddleware(new MiddlewareB())
			}

			private handle(request: Request, response: Response): void {}
		}
		const targetURL = "/"

		const { URL, handlers } = (new ControllerE(targetURL)).generateRoute()

		expect(handlers).toHaveLength(2)

		const request  = makeRequest()
		const { res: response, next, } = makeResponse()
		handlers[1](request, response, next)
		expect(middlewareFunction).toHaveBeenCalled()
	})

	it("can retain context upon passing", () => {
		const targetMessage = "Hello world"
		const handleFunction = jest.fn()

		class ControllerF extends Controller {
			const message = targetMessage

			private handle(request: Request, response: Response): void {
				handleFunction(this.message)
			}
		}
		const targetURL = "/"
		const { URL, handlers } = (new ControllerF(targetURL)).generateRoute()
		const request  = makeRequest()
		const { res: response, next, } = makeResponse()

		handlers[0](request, response, next)

		expect(handleFunction.mock.calls[0]).toEqual([ targetMessage ])
	})
})
