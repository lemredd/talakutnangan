import { faker } from "@faker-js/faker"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import type { RawURLInfo } from "!/types"
import Middleware from "!/routes/bases/middleware"

import PostJSONController from "./post_json_controller"

describe("Back-end: Post JSON Controller", () => {
	it("does include validation middleware", async () => {
		const controller = new class extends PostJSONController {
			getRawURLInfo(): RawURLInfo { return { baseURL: "/" } }
			handle(request: Request, response: Response): Promise<void> { return Promise.resolve() }
			get validationRules(): object { return {} }
		}

		const premiddlewares = controller.getPremiddlewares()
		const lastPremiddleware = premiddlewares[premiddlewares.length - 1]

		expect(lastPremiddleware instanceof Middleware).toBeTruthy()
	})

	it("can handle validated body", async () => {
		const controller = new class extends PostJSONController {
			getRawURLInfo(): RawURLInfo { return { baseURL: "/" } }
			handle(request: Request, response: Response): Promise<void> { return Promise.resolve() }

			get validationRules(): object {
				return {
					email: ["required", "email"]
				}
			}
		}

		const errors = await controller.validate({
			email: faker.internet.exampleEmail()
		})

		expect(errors).toHaveLength(0)
	})

	it("cannot handle invalid body with single field", async () => {
		const controller = new class extends PostJSONController {
			getRawURLInfo(): RawURLInfo { return { baseURL: "/" } }
			handle(request: Request, response: Response): Promise<void> { return Promise.resolve() }

			get validationRules(): object {
				return {
					email: ["required", "email"]
				}
			}
		}

		const errors = await controller.validate({
			email: faker.internet.domainName()
		})

		expect(errors).toHaveLength(1)
		expect(errors).toHaveProperty([0, "field"], "email")
	})

	it("cannot handle invalid body with multiple fields", async () => {
		const controller = new class extends PostJSONController {
			getRawURLInfo(): RawURLInfo { return { baseURL: "/" } }
			handle(request: Request, response: Response): Promise<void> { return Promise.resolve() }

			get validationRules(): object {
				return {
					username: ["required", "minLength:15"],
					email: ["required", "email"]
				}
			}
		}

		const errors = await controller.validate({
			username: faker.random.alpha(14),
			email: faker.internet.domainName()
		})

		expect(errors).toHaveLength(2)
		expect(errors).toHaveProperty([0, "field"], "email")
		expect(errors).toHaveProperty([1, "field"], "username")
	})

	it("does validation middleware works properly with valid values", async () => {
		const controller = new class extends PostJSONController {
			getRawURLInfo(): RawURLInfo { return { baseURL: "/" } }
			handle(request: Request, response: Response): Promise<void> { return Promise.resolve() }
			get validationRules(): object {
				return {
					email: ["required", "email"]
				}
			}
		}

		const middleware = controller.createValidationMiddleware()
		const request  = makeRequest()
		const { res: response, next } = makeResponse()
		request.body = {
			email: faker.internet.exampleEmail()
		}

		await middleware.intermediate(request, response, next)

		expect(next).toBeCalled()
	})

	it("does validation middleware works properly with invalid values", async () => {
		const controller = new class extends PostJSONController {
			getRawURLInfo(): RawURLInfo { return { baseURL: "/" } }
			handle(request: Request, response: Response): Promise<void> { return Promise.resolve() }
			get validationRules(): object {
				return {
					email: ["required", "email"]
				}
			}
		}

		const middleware = controller.createValidationMiddleware()
		const request  = makeRequest()
		const { res: response, next } = makeResponse()
		request.body = {
			email: faker.internet.domainName()
		}

		await middleware.intermediate(request, response, next)

		expect(next).not.toBeCalled()
		const mockResponse = <{[key: string]: jest.MockedFn<(number) => Response>}><unknown>response
		expect(mockResponse.status).toHaveBeenCalled()
		expect(mockResponse.status.mock.calls[0]).toEqual([ StatusCodes.BAD_REQUEST ])
		expect(mockResponse.json.mock.calls[0][0]).toHaveProperty([0, "field"], "email")
	})
})
