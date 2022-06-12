import { StatusCodes } from "http-status-codes"
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import { MockResponse } from "!/types/test"
import { Request, Response } from "!/types/dependent"

import QueryValidation from "!/middlewares/authorization/query_validation"

import QueryController from "./query_controller"

describe("Back-end: Query Controller", () => {
	abstract class BaseTestController extends QueryController {
		get filePath(): string { return __filename }

		get policy(): null { return null }

		handle(_request: Request, _response: Response): Promise<void> { return Promise.resolve() }
	}

	it("does include validation middleware", async () => {
		const controller = new class extends BaseTestController {
			get queryValidationRules(): object { return {} }
		}

		const middlewares = controller.middlewares
		const lastMiddleware = middlewares[middlewares.length - 1]

		expect(lastMiddleware instanceof QueryValidation).toBeTruthy()
	})

	it("does validation middleware works properly with valid values", async () => {
		const controller = new class extends BaseTestController {
			get queryValidationRules(): object {
				return {
					order: ["required", "in:ascending,descending"]
				}
			}
		}

		const middlewares = controller.handlers.middlewares
		const validationMiddleware = middlewares[middlewares.length - 1]
		const request  = makeRequest<Request>()
		const { res: response, next } = makeResponse()
		request.query = {
			order: "ascending"
		}

		await validationMiddleware.intermediate(request, response, next)

		expect(next).toBeCalled()
	})

	it("does validation middleware works properly with invalid single value", async () => {
		const controller = new class extends BaseTestController {
			get queryValidationRules(): object {
				return {
					order: ["required", "in:ascending,descending"]
				}
			}
		}

		const middlewares = controller.handlers.middlewares
		const validationMiddleware = middlewares[middlewares.length - 1]
		const request  = makeRequest<Request>()
		const { res: response, next } = makeResponse()
		request.query = {
			order: "acending"
		}

		await validationMiddleware.intermediate(request, response, next)

		expect(next).not.toBeCalled()
		const mockResponse = <MockResponse><unknown>response
		expect(mockResponse.status).toHaveBeenCalled()
		expect(mockResponse.status.mock.calls[0]).toEqual([ StatusCodes.BAD_REQUEST ])
		expect(mockResponse.json.mock.calls[0][0]).toHaveProperty([0, "field"], "order")
	})

	it("does validation middleware works properly with invalid multiple values", async () => {
		const controller = new class extends BaseTestController {
			get filePath(): string { return __filename }
			handle(request: Request, response: Response): Promise<void> { return Promise.resolve() }
			get queryValidationRules(): object {
				return {
					order: ["required", "in:ascending,descending"],
					limit: ["required", "numeric"]
				}
			}
		}

		const middlewares = controller.handlers.middlewares
		const validationMiddleware = middlewares[middlewares.length - 1]
		const request  = makeRequest<Request>()
		const { res: response, next } = makeResponse()
		request.query = {
			order: "decending",
			limit: "a2"
		}

		await validationMiddleware.intermediate(request, response, next)

		expect(next).not.toBeCalled()
		const mockResponse = <MockResponse><unknown>response
		expect(mockResponse.status).toHaveBeenCalled()
		expect(mockResponse.status.mock.calls[0]).toEqual([ StatusCodes.BAD_REQUEST ])
		expect(mockResponse.json.mock.calls[0][0]).toHaveProperty([0, "field"], "limit")
		expect(mockResponse.json.mock.calls[0][0]).toHaveProperty([1, "field"], "order")
	})
})
