import { faker } from "@faker-js/faker"
import { Request, Response } from "express"
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import type { RawURLInfo } from "!/types"

import PostJSONController from "./post_json_controller"

describe("Back-end: Post JSON Controller", () => {
	it("can handle validated body", async () => {
		const handlerFunction = jest.fn()
		const controller = new class extends PostJSONController {
			getRawURLInfo(): RawURLInfo { return { baseURL: "/" } }

			get validationRules(): object {
				return {
					email: ["required", "email"]
				}
			}

			handleValidatedBody(request: Request, response: Response): Promise<void> {
				handlerFunction()
				return Promise.resolve()
			}
		}
		const request  = makeRequest()
		const { res: response } = makeResponse()
		request.body = {
			email: faker.internet.exampleEmail()
		}

		await controller.handle(request, response)

		expect(handlerFunction).toHaveBeenCalled()
	})

	it("cannot handle invalid body with single field", async () => {
		const handlerFunction = jest.fn()
		const controller = new class extends PostJSONController {
			getRawURLInfo(): RawURLInfo { return { baseURL: "/" } }

			get validationRules(): object {
				return {
					email: ["required", "email"]
				}
			}

			handleValidatedBody(request: Request, response: Response): Promise<void> {
				handlerFunction()
				return Promise.resolve()
			}
		}
		const request  = makeRequest()
		const { res: response } = makeResponse()
		request.body = {
			email: faker.internet.domainName()
		}

		await controller.handle(request, response)

		expect(handlerFunction).not.toHaveBeenCalled()
	})

	it("cannot handle invalid body with multiple fields", async () => {
		const handlerFunction = jest.fn()
		const controller = new class extends PostJSONController {
			getRawURLInfo(): RawURLInfo { return { baseURL: "/" } }

			get validationRules(): object {
				return {
					username: ["required", "minLength:15"],
					email: ["required", "email"]
				}
			}

			handleValidatedBody(request: Request, response: Response): Promise<void> {
				handlerFunction()
				return Promise.resolve()
			}
		}
		const request  = makeRequest()
		const { res: response } = makeResponse()
		request.body = {
			username: faker.random.alpha(14),
			email: faker.internet.domainName()

		}

		await controller.handle(request, response)

		expect(handlerFunction).not.toHaveBeenCalled()
	})
})
