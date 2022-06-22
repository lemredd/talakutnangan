import { faker } from "@faker-js/faker"

import { Request, Response } from "!/types/dependent"

import MockRequester from "~/set-ups/mock_requester"

import JSONController from "./json_controller"

describe("Back-end: JSON Controller Special Validation", () => {
	const requester  = new MockRequester()

	abstract class BaseTestController extends JSONController {
		get filePath(): string { return __filename }

		get policy(): null { return null }
	}

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

		const middlewares = controller.middlewares
		const validationMiddleware = middlewares[middlewares.length - 1]
		requester.customizeRequest({
			body: {
				email: faker.internet.exampleEmail()
			}
		})

		await requester.runMiddleware(validationMiddleware!.intermediate.bind(validationMiddleware))

		requester.expectSuccess()
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
		requester.customizeRequest({
			body: {
				email: faker.internet.domainName()
			}
		})

		await requester.runMiddleware(validationMiddleware!.intermediate.bind(validationMiddleware))

		const errorJSONBody = requester.expectFailure(requester.status.BAD_REQUEST)
		expect(errorJSONBody).toHaveProperty([0, "field"], "email")
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
		requester.customizeRequest({
			body: {
				username: faker.random.alpha(14),
				email: faker.internet.domainName()
			}
		})

		await requester.runMiddleware(validationMiddleware!.intermediate.bind(validationMiddleware))

		const errorJSONBody = requester.expectFailure(requester.status.BAD_REQUEST)
		expect(errorJSONBody).toHaveProperty([0, "field"], "email")
		expect(errorJSONBody).toHaveProperty([1, "field"], "username")
	})
})
