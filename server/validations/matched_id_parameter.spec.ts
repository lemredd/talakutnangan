import ErrorBag from "$!/errors/error_bag"
import Validation from "./matched_id_parameter"
import MockRequester from "~/setups/mock_requester"

describe("Middleware: Matched ID parameter validation", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const middleware = new Validation()
		requester.customizeRequest({
			"params": {
				"id": "1"
			},
			"body": {
				"data": {
					"id": "1"
				}
			},
			"ensureThisPropertyExists": true
		})

		await requester.runMiddleware(middleware.intermediate.bind(middleware))

		const request = requester.expectSuccess()
		expect(request).toHaveProperty("params.id", "1")
		expect(request).toHaveProperty("body.data.id", "1")
		expect(request).toHaveProperty("ensureThisPropertyExists", true)
	})

	it("cannot accept different IDs", async() => {
		const middleware = new Validation()
		requester.customizeRequest({
			"params": {
				"id": "1"
			},
			"body": {
				"data": {
					"id": "2"
				}
			}
		})

		await requester.runMiddleware(middleware.intermediate.bind(middleware))

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "body.data.id")
	})
})
