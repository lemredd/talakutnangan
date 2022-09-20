/* eslint-disable max-classes-per-file */
import type { Request } from "!/types/dependent"
import type { FieldRules } from "!/types/validation"

import MockRequester from "~/setups/mock_requester"
import ErrorBag from "$!/errors/error_bag"

import integer from "!/validators/base/integer"
import required from "!/validators/base/required"
import oneOf from "!/validators/comparison/one-of"

import Base from "./validation"

describe("Back-end Base: Validation", () => {
	const requester = new MockRequester()

	abstract class TestBase extends Base {
		getSubject(request: Request): object {
			return request.body
		}
	}

	it("does validation middleware works properly with valid values", async() => {
		const middleware = new class extends TestBase {
			constructor() {
				super((): FieldRules => ({
					"order": {
						"constraints": {
							"oneOf": {
								"values": [ "ascending", "descending" ]
							}
						},
						"pipes": [ required, oneOf ]
					}
				}))
			}
		}()

		requester.customizeRequest({
			"body": {
				"order": "ascending"
			}
		})

		await requester.runMiddleware(middleware.intermediate.bind(middleware))

		requester.expectSuccess()
	})

	it("does validation middleware works properly with single invalid value", async() => {
		const middleware = new class extends TestBase {
			constructor() {
				super((): FieldRules => ({
					"order": {
						"constraints": {
							"oneOf": {
								"values": [ "ascending", "descending" ]
							}
						},
						"pipes": [ required, oneOf ]
					}
				}))
			}
		}()
		requester.customizeRequest({
			"body": {
				"order": "acending"
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

	it("does validation middleware works properly with single invalid named value", async() => {
		const friendlyName = "resource order"
		const middleware = new class extends TestBase {
			constructor() {
				super((): FieldRules => ({
					"order": {
						"constraints": {
							"oneOf": {
								"values": [ "ascending", "descending" ]
							}
						},
						friendlyName,
						"pipes": [ required, oneOf ]
					}
				}))
			}
		}()
		requester.customizeRequest({
			"body": {
				"order": "acending"
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
					expect(unitErrors[0]).toHaveProperty("detail")
					expect(unitErrors[0].detail).toContain(friendlyName)
				}
			]
		])
	})

	it("does validation middleware works properly with invalid multiple values", async() => {
		const middleware = new class extends TestBase {
			constructor() {
				super((): FieldRules => ({
					"limit": {
						"constraints": {},
						"pipes": [ required, integer ]
					},
					"order": {
						"constraints": {
							"oneOf": {
								"values": [ "ascending", "descending" ]
							}
						},
						"pipes": [ required, oneOf ]
					}
				}))
			}
		}()

		requester.customizeRequest({
			"body": {
				"limit": "a2",
				"order": "decending"
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
