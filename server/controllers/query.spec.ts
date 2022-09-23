import type { Request, Response } from "!/types/dependent"
import type { FieldRules } from "!/types/validation"

import MockRequester from "~/setups/mock_requester"

import required from "!/validators/base/required"
import oneOf from "!/validators/comparison/one-of"

import QueryController from "./query"

describe("Back-end: Query Controller Special Validation", () => {
	const requester = new MockRequester()

	abstract class BaseTestController extends QueryController {
		get filePath(): string { return __filename }

		get policy(): null { return null }

		handle(unusedRequest: Request, unusedResponse: Response)
		: Promise<void> { return Promise.resolve() }
	}

	it("does validation middleware works properly with valid values", async() => {
		const controller = new class extends BaseTestController {
			makeQueryRuleGenerator(unusedRequest: Request): FieldRules {
				return {
					"order": {
						"constraints": {
							"oneOf": {
								"values": [ "ascending", "descending" ]
							}
						},
						"pipes": [ required, oneOf ]
					}
				}
			}
		}()

		const { middlewares } = controller.handlers
		const validationMiddleware = middlewares[middlewares.length - 1]
		requester.customizeRequest({
			"query": {
				"order": "ascending"
			}
		})

		await requester.runMiddleware(validationMiddleware!.intermediate.bind(validationMiddleware))

		requester.expectSuccess()
	})
})
