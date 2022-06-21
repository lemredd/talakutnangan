import { Request, Response } from "!/types/dependent"

import MockRequester from "~/set-ups/mock_requester"

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

		const errorJSONBody = requester.expectFailure(requester.status.BAD_REQUEST)
		expect(errorJSONBody).toHaveProperty([0, "field"], "order")
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

		const errorJSONBody = requester.expectFailure(requester.status.BAD_REQUEST)
		expect(errorJSONBody).toHaveProperty([0, "field"], "limit")
		expect(errorJSONBody).toHaveProperty([1, "field"], "order")
	})
})
