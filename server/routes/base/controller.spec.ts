import { Request, Response, NextFunction } from "express"
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import type { Method, RawRoute } from "!/types"
import Middleware from "!/routes/base/middleware"

import Controller from "./controller"

describe("Back-end: Base Controller", () => {
	it("can create simple route", () => {
		const targetURL = "/"

		class ControllerA extends Controller {
			getRawRoute(): RawRoute {
				return {
					method: "get",
					baseURL: targetURL
				}
			}

			handle(request: Request, response: Response): Promise<void> {
				return Promise.resolve()
			}
		}

		const { URL, handlers } = (new ControllerA()).generateRoute()

		expect(URL).toBe(targetURL)
		expect(handlers).toHaveLength(1)
	})

	it("can override route", () => {
		const targetURL = "/a/b"

		class ControllerB extends Controller {
			getRawRoute(): RawRoute {
				return {
					method: "get",
					baseURL: targetURL,
					overridesPrefix: true
				}
			}

			handle(request: Request, response: Response): Promise<void> {
				return Promise.resolve()
			}
		}

		const { URL, handlers } = (new ControllerB()).generateRoute("/c")

		expect(URL).toBe(targetURL)
	})

	it("can prefix route", () => {
		const targetURL = "/c/d"

		class ControllerC extends Controller {
			getRawRoute(): RawRoute {
				return {
					method: "get",
					baseURL: targetURL,
					overridesPrefix: false
				}
			}

			handle(request: Request, response: Response): Promise<void> {
				return Promise.resolve()
			}
		}

		const { URL, handlers } = (new ControllerC()).generateRoute("/a/b")

		expect(URL).toBe(`/a/b/${targetURL}`)
	})

	it("can prepend middleware", () => {
		const targetURL = "/"
		const middlewareFunction = jest.fn()

		class MiddlewareA extends Middleware {
			intermediate(request: Request, response: Response, next: NextFunction): void {
				middlewareFunction()
			}
		}

		class ControllerD extends Controller {
			getRawRoute(): RawRoute {
				return {
					method: "get",
					baseURL: targetURL
				}
			}

			handle(request: Request, response: Response): Promise<void> {
				return Promise.resolve()
			}

			getPremiddlewares(): Middleware[] {
				return [
					...super.getPremiddlewares(),
					new MiddlewareA()
				]
			}
		}

		const { URL, handlers } = (new ControllerD()).generateRoute()

		expect(handlers).toHaveLength(2)

		const request  = makeRequest()
		const { res: response, next, } = makeResponse()
		handlers[0](request, response, next)
		expect(middlewareFunction).toHaveBeenCalled()
	})

	it("can append middleware", () => {
		const middlewareFunction = jest.fn()
		const targetURL = "/"

		class MiddlewareB extends Middleware {
			intermediate(request: Request, response: Response, next: NextFunction): void {
				middlewareFunction()
			}
		}

		class ControllerE extends Controller {
			getRawRoute(): RawRoute {
				return {
					method: "get",
					baseURL: targetURL
				}
			}

			handle(request: Request, response: Response): Promise<void> {
				return Promise.resolve()
			}

			getPostmiddlewares(): Middleware[] {
				return [
					...super.getPostmiddlewares(),
					new MiddlewareB()
				]
			}
		}

		const { URL, handlers } = (new ControllerE()).generateRoute()

		expect(handlers).toHaveLength(2)

		const request  = makeRequest()
		const { res: response, next, } = makeResponse()
		handlers[1](request, response, next)
		expect(middlewareFunction).toHaveBeenCalled()
	})

	it("can retain context upon passing", () => {
		const targetMessage = "Hello world"
		const handleFunction = jest.fn()
		const targetURL = "/"

		class ControllerF extends Controller {
			private message = targetMessage

			getRawRoute(): RawRoute {
				return {
					method: "get",
					baseURL: targetURL
				}
			}

			async handle(request: Request, response: Response): Promise<void> {
				handleFunction(this.message)
			}
		}
		const controller = new ControllerF()
		const request  = makeRequest()
		const { res: response, } = makeResponse()

		controller.handle(request, response)

		expect(handleFunction.mock.calls[0]).toEqual([ targetMessage ])
	})
})
