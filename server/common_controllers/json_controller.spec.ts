import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"

import { faker } from "@faker-js/faker"
import MockRequester from "~/set-ups/mock_requester"

import required from "!/app/validators/base/required"
import regex from "!/app/validators/comparison/regex"

import JSONController from "./json_controller"

describe("Back-end: JSON Controller Special Validation", () => {
	const requester  = new MockRequester()

	abstract class BaseTestController extends JSONController {
		get filePath(): string { return __filename }

		get policy(): null { return null }
	}

	it("does validation middleware works properly with valid values", async () => {
		const controller = new class extends BaseTestController {
			makeBodyRuleGenerator(request: Request): FieldRules {
				return {
					order: {
						pipes: [ required, regex ],
						constraints: {
							regex: {
								match: /.*@.*/
							}
						}
					}
				}
			}

			get filePath(): string { return __filename }

			handle(request: Request, response: Response): Promise<void> { return Promise.resolve() }
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
})
