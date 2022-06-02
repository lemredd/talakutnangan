import { faker } from "@faker-js/faker"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import type { RawURLInfo } from "!/types"

import PostJSONController from "./post_json_controller"

describe("Back-end: Post JSON Controller", () => {
	it("does include validation as middleware", async () => {
		const controller = new class extends PostJSONController {
			getRawURLInfo(): RawURLInfo { return { baseURL: "/" } }
			handle(request: Request, response: Response): Promise<void> { return Promise.resolve() }
			get validationRules(): object { return {} }
		}

		const premiddlewares = controller.getPremiddlewares()
		const lastPremiddleware = premiddlewares[premiddlewares.length - 1]

		expect((lastPremiddleware as unknown as Function).name).toBe("bound validateRequest")
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

		const request  = makeRequest()
		const { res: response, next } = makeResponse()
		request.body = {
			email: faker.internet.exampleEmail()
		}

		await controller.validateRequest(request, response, next)

		expect(next).toHaveBeenCalled()
		// Ensure the function has been bound
		const premiddlewares = controller.getPremiddlewares()
		expect((premiddlewares[premiddlewares.length - 1] as unknown as Function).name)
			.toBe("bound validateRequest")
	})

	it("cannot handle invalid body with single field", async () => {
		const handlerFunction = jest.fn()
		const controller = new class extends PostJSONController {
			getRawURLInfo(): RawURLInfo { return { baseURL: "/" } }
			handle(request: Request, response: Response): Promise<void> { return Promise.resolve() }

			get validationRules(): object {
				return {
					email: ["required", "email"]
				}
			}
		}
		const request  = makeRequest()
		const { res: response, next } = makeResponse()
		request.body = {
			email: faker.internet.domainName()
		}

		await controller.validateRequest(request, response, next)

		expect(next).not.toHaveBeenCalled()
		const mockResponse = <{[key: string]: jest.MockedFn<(number) => Response>}><unknown>response
		expect(mockResponse.status).toHaveBeenCalled()
		expect(mockResponse.status.mock.calls[0]).toEqual([ StatusCodes.BAD_REQUEST ])
		expect(mockResponse.json.mock.calls[0][0]).toHaveProperty([0, "field"], "email")
	})

	it("cannot handle invalid body with multiple fields", async () => {
		const handlerFunction = jest.fn()
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
		const request  = makeRequest()
		const { res: response, next } = makeResponse()
		request.body = {
			username: faker.random.alpha(14),
			email: faker.internet.domainName()
		}

		await controller.validateRequest(request, response, next)

		expect(next).not.toHaveBeenCalled()
		const mockResponse = <{[key: string]: jest.MockedFn<(number) => Response>}><unknown>response
		expect(mockResponse.status).toHaveBeenCalled()
		expect(mockResponse.status.mock.calls[0]).toEqual([ StatusCodes.BAD_REQUEST ])
		expect(mockResponse.json.mock.calls[0][0]).toHaveProperty([0, "field"], "email")
		expect(mockResponse.json.mock.calls[0][0]).toHaveProperty([1, "field"], "username")
	})
})
