import type { Request } from "!/types/dependent"
import type { FieldRules } from "!/types/validation"

import MockRequester from "~/set-ups/mock_requester"
import ErrorBag from "$!/errors/error_bag"

import integer from "!/app/validators/base/integer"
import required from "!/app/validators/base/required"
import oneOf from "!/app/validators/comparison/one-of"

import Base from "./validation"

describe("Back-end Base: Validation", () => {
	const requester  = new MockRequester()

	abstract class TestBase extends Base {
		getSubject(request: Request): object {
			return request.body
		}
	}

	it("does validation middleware works properly with valid values", async () => {
		const middleware = new class extends TestBase {
			constructor() {
				super((request: Request): FieldRules => {
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
				})
			}
		}

		requester.customizeRequest({
			body: {
				order: "ascending"
			}
		})

		await requester.runMiddleware(middleware.intermediate.bind(middleware))

		requester.expectSuccess()
	})

	it("does validation middleware works properly with invalid single value", async () => {
		const middleware = new class extends TestBase {
			constructor() {
				super((request: Request): FieldRules => {
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
				})
			}
		}
		requester.customizeRequest({
			body: {
				order: "acending"
			}
		})

		await requester.runMiddleware(middleware.intermediate.bind(middleware))

		requester.expectNext([
			[
				(error: any) => {
					expect(error).toBeInstanceOf(ErrorBag)
					const unitErrors = error.toJSON()
					expect(unitErrors).toHaveLength(1)
					expect(unitErrors[0]).toHaveProperty("source.pointer", "order")
				}
			]
		])
	})

	it("does validation middleware works properly with invalid multiple values", async () => {
		const middleware = new class extends TestBase {
			constructor() {
				super((request: Request): FieldRules => {
					return {
						order: {
							pipes: [ required, oneOf ],
							constraints: {
								oneOf: {
									values: [ "ascending", "descending" ]
								}
							}
						},
						limit: {
							pipes: [ required, integer ],
							constraints: {}
						}
					}
				})
			}
		}

		requester.customizeRequest({
			body: {
				order: "decending",
				limit: "a2"
			}
		})

		await requester.runMiddleware(middleware.intermediate.bind(middleware))

		requester.expectNext([
			[
				(error: any) => {
					expect(error).toBeInstanceOf(ErrorBag)
					const unitErrors = error.toJSON()
					expect(unitErrors).toHaveLength(2)
					expect(unitErrors[0]).toHaveProperty("source.pointer", "limit")
					expect(unitErrors[1]).toHaveProperty("source.pointer", "order")
				}
			]
		])
	})
})
