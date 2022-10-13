import type { PostAttachmentDocument } from "$/types/documents/post_attachment"

import { POST_ATTACHMENT_LINK } from "$/constants/template_links"

import RequestEnvironment from "$/singletons/request_environment"
import Fetcher from "./post_attachment"

describe("Fetcher: Post attachment", () => {
	it("can create with file", async() => {
		const mockLink = "http://example.com"
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": {
					"attributes": {
						"fileContents": mockLink,
						"fileType": "text/plain"
					},
					"id": "1",
					"type": "post_attachment"
				}
			} as PostAttachmentDocument<"read", "serialized">),
			{ "status": RequestEnvironment.status.OK }
		)
		const fetcher = new Fetcher()
		const response = await fetcher.createWithFile({} as FormData)

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", POST_ATTACHMENT_LINK.unbound)
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		expect(response).toHaveProperty("body.data.fileContents", mockLink)
	})
})
