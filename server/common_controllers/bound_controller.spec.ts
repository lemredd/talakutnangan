import { Request, Response } from "!/types/dependent"

import MockRequester from "~/set-ups/mock_requester"

import ErrorBag from "$!/errors/error_bag"

import BoundController from "./bound_controller"

abstract class BaseTestController extends BoundController {
	get filePath(): string { return __filename }

	get policy(): null { return null }

	handle(_request: Request, _response: Response): Promise<void> { return Promise.resolve() }
}

describe("Controller: Bound Controller Special Validation", () => {
	const requester  = new MockRequester()

	it("does validation middleware works properly with valid values", async () => {
		const controller = new class extends BaseTestController {
			get routeParameterValidationRules(): object {
				return {
					id: ["required", "numeric"]
				}
			}
		}

		const middlewares = controller.middlewares
		const validationMiddleware = middlewares[middlewares.length - 1]
		requester.customizeRequest({
			params: {
				id: "1"
			}
		})

		await requester.runMiddleware(validationMiddleware!.intermediate.bind(validationMiddleware))

		requester.expectSuccess()
	})

	it("does validation middleware works properly with invalid single value", async () => {
		const controller = new class extends BaseTestController {
			get routeParameterValidationRules(): object {
				return {
					id: ["required", "numeric"]
				}
			}
		}

		const middlewares = controller.middlewares
		const validationMiddleware = middlewares[middlewares.length - 1]
		requester.customizeRequest({
			params: {
				id: "NaN"
			}
		})

		await requester.runMiddleware(validationMiddleware!.intermediate.bind(validationMiddleware))

		requester.expectNext([
			[
				(error: any) => {
					expect(error).toBeInstanceOf(ErrorBag)
					const unitErrors = error.toJSON()
					expect(unitErrors).toHaveLength(1)
					// TODO: Think of way to override single bound
					expect(unitErrors[0]).toHaveProperty("source.pointer", "id")
				}
			]
		])
	})

	it("does validation middleware works properly with invalid multiple values", async () => {
		const controller = new class extends BaseTestController {
			get filePath(): string { return __filename }
			handle(request: Request, response: Response): Promise<void> { return Promise.resolve() }
			get routeParameterValidationRules(): object {
				return {
					id: ["required", "numeric"],
					commentID: ["required", "numeric"]
				}
			}
		}

		const middlewares = controller.middlewares
		const validationMiddleware = middlewares[middlewares.length - 1]
		requester.customizeRequest({
			params: {
				id: "NaN",
				commentID: "Infinite"
			}
		})

		await requester.runMiddleware(validationMiddleware!.intermediate.bind(validationMiddleware))

		requester.expectNext([
			[
				(error: any) => {
					expect(error).toBeInstanceOf(ErrorBag)
					const unitErrors = error.toJSON()
					expect(unitErrors).toHaveLength(2)
					// TODO: Think of way to override multiple bound
					expect(unitErrors[0]).toHaveProperty("source.pointer", "commentID")
					expect(unitErrors[1]).toHaveProperty("source.pointer", "id")
				}
			]
		])
	})
})
