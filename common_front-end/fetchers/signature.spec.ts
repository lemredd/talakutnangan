import type { SignatureDocument } from "$/types/documents/signature"

import RequestEnvironment from "$/helpers/request_environment"
import SignatureFetcher from "./signature"

describe("Communicator: SignatureFetcher", () => {
	it("can log in", async () => {
		fetchMock.mockResponseOnce(JSON.stringify({
			data: {
				id: 1,
				type: "signature",
				links: {
					self: "http://localhost:16000/api/signature/1"
				}
			}
		} as SignatureDocument<string>),
		{ status: RequestEnvironment.status.OK })

		SignatureFetcher.initialize("/api")

		const fetcher = new SignatureFetcher()
		const response = await fetcher.renew(1, {} as FormData)

		const request = (fetch as jest.Mock<any, any>).mock.calls[0][0]
		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty("url", "/api/user/1/relationships/signature")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		expect(response).toHaveProperty(
			"body.data.links.self",
			"http://localhost:16000/api/signature/1")
	})
})
