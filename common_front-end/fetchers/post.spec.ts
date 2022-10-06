import type { PostDocument } from "$/types/documents/post"

import { POST_LINK } from "$/constants/template_links"

import RequestEnvironment from "$/singletons/request_environment"
import Fetcher from "./post"

describe("Fetcher: Post", () => {
	it("can create with file", async() => {
		const mockContent = "Hello world!"
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": {
					"attributes": {
						"content": mockContent
					},
					"id": "1",
					"type": "post"
				}
			} as PostDocument<"read">),
			{ "status": RequestEnvironment.status.OK }
		)
		const fetcher = new Fetcher()
		const response = await fetcher.createWithFile({} as FormData)

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", POST_LINK.unbound)
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		expect(response).toHaveProperty("body.data.content", mockContent)
	})
})
