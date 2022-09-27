import type { SignatureDocument } from "$/types/documents/signature"

import RequestEnvironment from "$/singletons/request_environment"
import SignatureFetcher from "./signature"

describe("Fetcher: Signature", () => {
	it("can get signature URL", async() => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": {
					"attributes": {
						"fileContents": "http://localhost:16000/api/signature/1"
					},
					"id": "1",
					"type": "signature"
				}
			} as SignatureDocument<"read">),
			{ "status": RequestEnvironment.status.OK }
		)

		SignatureFetcher.initialize("/api")

		const fetcher = new SignatureFetcher()
		const response = await fetcher.renew("1", {} as FormData)

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty("url", "/api/user/1/relationships/signature")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		expect(response).toHaveProperty(
			"body.data.fileContents",
			"http://localhost:16000/api/signature/1")
	})
})
