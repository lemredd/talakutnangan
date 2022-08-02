import type { Request, Response } from "!/types/dependent"
import type { FieldRules } from "!/types/validation"

import MockRequester from "~/set-ups/mock_requester"

import required from "!/app/validators/base/required"
import oneOf from "!/app/validators/comparison/one-of"

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
			makeQueryRuleGenerator(request: Request): FieldRules {
				return {
					order: {
						pipes: [ required, oneOf ],
						constraints: {
							oneOf: {
								values: [ "ascending", "descending" ]
							}
						}
					}
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
})
