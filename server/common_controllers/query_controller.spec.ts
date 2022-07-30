import { Request, Response } from "!/types/dependent"

import MockRequester from "~/set-ups/mock_requester"

import ErrorBag from "$!/errors/error_bag"

import QueryController from "./query_controller"

describe("Back-end: Query Controller Special Validation", () => {
	const requester  = new MockRequester()

	abstract class BaseTestController extends QueryController {
		get filePath(): string { return __filename }

		get policy(): null { return null }

		handle(_request: Request, _response: Response): Promise<void> { return Promise.resolve() }
	}

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
		requester.customizeRequest({
			query: {
				order: "ascending"
			}
		})

		await requester.runMiddleware(validationMiddleware!.intermediate.bind(validationMiddleware))

		requester.expectSuccess()
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
		requester.customizeRequest({
			query: {
				order: "acending"
			}
		})

		await requester.runMiddleware(validationMiddleware!.intermediate.bind(validationMiddleware))

		requester.expectNext([
			[
				(error: any) => {
					expect(error).toBeInstanceOf(ErrorBag)
					const unitErrors = error.toJSON()
					expect(unitErrors).toHaveLength(1)
					expect(unitErrors[0]).toHaveProperty("source.parameter", "order")
				}
			]
		])
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
		requester.customizeRequest({
			query: {
				order: "decending",
				limit: "a2"
			}
		})

		await requester.runMiddleware(validationMiddleware!.intermediate.bind(validationMiddleware))

		requester.expectNext([
			[
				(error: any) => {
					expect(error).toBeInstanceOf(ErrorBag)
					const unitErrors = error.toJSON()
					expect(unitErrors).toHaveLength(2)
					expect(unitErrors[0]).toHaveProperty("source.parameter", "limit")
					expect(unitErrors[1]).toHaveProperty("source.parameter", "order")
				}
			]
		])
	})
})
