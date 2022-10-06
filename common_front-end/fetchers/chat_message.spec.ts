import type {
	ChatMessageResource,
	ChatMessageDocument,
	ChatMessageRelationships
} from "$/types/documents/chat_message"
import type { AttachedChatFileResource } from "$/types/documents/attached_chat_file"

import RequestEnvironment from "$/singletons/request_environment"
import Fetcher from "./chat_message"

describe("Fetcher: Chat message", () => {
	it("can get chat message URL", async() => {
		const fileContents = "http://localhost:16000/api/attached_chat_file/1"
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": {
					"attributes": {
						"kind": "file"
					},
					"id": "1",
					"relationships": {
						"attachedChatFile": {
							"data": {
								"id": "1",
								"type": "attached_chat_file"
							}
						}
					},
					"type": "chat_message"
				} as ChatMessageResource<"read"> & ChatMessageRelationships<"read">,
				"included": [
					{
						"attributes": {
							fileContents
						},
						"id": "1",
						"type": "attached_chat_file"
					} as AttachedChatFileResource
				]
			} as ChatMessageDocument<"read">),
			{ "status": RequestEnvironment.status.OK }
		)
		const fetcher = new Fetcher()
		const response = await fetcher.createWithFile({} as FormData)

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/chat_message/create_with_file")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		expect(response).toHaveProperty("body.data.kind", "file")
		expect(response).toHaveProperty("body.data.attachedChatFile.data.fileContents", fileContents)
	})
})
