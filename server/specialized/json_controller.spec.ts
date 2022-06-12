import { faker } from "@faker-js/faker"
import { StatusCodes } from "http-status-codes"
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import { MockResponse } from "!/types/test"
import { Request, Response } from "!/types/dependent"

import Validation from "!/bases/middleware"

import JSONController from "./json_controller"

describe("Back-end: Post JSON Controller", () => {
	abstract class BaseTestController extends JSONController {
		get filePath(): string { return __filename }

		get policy(): null { return null }
	}

	it("does include validation middleware", async () => {
		const controller = new class extends BaseTestController {
			handle(request: Request, response: Response): Promise<void> { return Promise.resolve() }
			get bodyValidationRules(): object { return {} }
		}

		const middlewares = controller.middlewares
		const lastMiddleware = middlewares[middlewares.length - 1]

		expect(lastMiddleware instanceof Validation).toBeTruthy()
	})

	it("does validation middleware works properly with valid values", async () => {
		const controller = new class extends BaseTestController {
			get filePath(): string { return __filename }
			handle(request: Request, response: Response): Promise<void> { return Promise.resolve() }
			get bodyValidationRules(): object {
				return {
					email: ["required", "email"]
				}
			}
		}

		const middlewares = controller.handlers.middlewares
		const validationMiddleware = middlewares[middlewares.length - 1]
		const request  = makeRequest<Request>()
		const { res: response, next } = makeResponse()
		request.body = {
			email: faker.internet.exampleEmail()
		}

		await validationMiddleware.intermediate(request, response, next)

		expect(next).toBeCalled()
	})

	it("does validation middleware works properly with invalid single value", async () => {
		const controller = new class extends BaseTestController {
			get filePath(): string { return __filename }
			handle(request: Request, response: Response): Promise<void> { return Promise.resolve() }
			get bodyValidationRules(): object {
				return {
					email: ["required", "email"]
				}
			}
		}

		const middlewares = controller.handlers.middlewares
		const validationMiddleware = middlewares[middlewares.length - 1]
		const request  = makeRequest<Request>()
		const { res: response, next } = makeResponse()
		request.body = {
			email: faker.internet.domainName()
		}

		await validationMiddleware.intermediate(request, response, next)

		expect(next).not.toBeCalled()
		const mockResponse = <MockResponse><unknown>response
		expect(mockResponse.status).toHaveBeenCalled()
		expect(mockResponse.status.mock.calls[0]).toEqual([ StatusCodes.BAD_REQUEST ])
		expect(mockResponse.json.mock.calls[0][0]).toHaveProperty([0, "field"], "email")
	})

	it("does validation middleware works properly with invalid multiple values", async () => {
		const controller = new class extends BaseTestController {
			get filePath(): string { return __filename }
			handle(request: Request, response: Response): Promise<void> { return Promise.resolve() }
			get bodyValidationRules(): object {
				return {
					username: ["required", "minLength:15"],
					email: ["required", "email"]
				}
			}
		}

		const middlewares = controller.handlers.middlewares
		const validationMiddleware = middlewares[middlewares.length - 1]
		const request  = makeRequest<Request>()
		const { res: response, next } = makeResponse()
		request.body = {
			username: faker.random.alpha(14),
			email: faker.internet.domainName()
		}

		await validationMiddleware.intermediate(request, response, next)

		expect(next).not.toBeCalled()
		const mockResponse = <MockResponse><unknown>response
		expect(mockResponse.status).toHaveBeenCalled()
		expect(mockResponse.status.mock.calls[0]).toEqual([ StatusCodes.BAD_REQUEST ])
		expect(mockResponse.json.mock.calls[0][0]).toHaveProperty([0, "field"], "email")
	})
})
