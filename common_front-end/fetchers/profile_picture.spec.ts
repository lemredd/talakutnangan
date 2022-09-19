import type { ProfilePictureDocument } from "$/types/documents/profile_picture"

import RequestEnvironment from "$/singletons/request_environment"
import ProfilePictureFetcher from "./profile_picture"

describe("Fetcher: Profile Picture", () => {
	it("can create file", async() => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": {
					"attributes": {
						"fileContents": "http://localhost:16000/api/profile_picture/1"
					},
					"id": "1",
					"type": "profile_picture"
				}
			} as ProfilePictureDocument<"read">),
			{ "status": RequestEnvironment.status.OK }
		)

		ProfilePictureFetcher.initialize("/api")

		const fetcher = new ProfilePictureFetcher()
		const response = await fetcher.createFile("1", {} as FormData)

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/user/1/relationships/profile_picture")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		expect(response).toHaveProperty(
			"body.data.fileContents",
			"http://localhost:16000/api/profile_picture/1")
	})

	it("can update file", async() => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": {
					"attributes": {
						"fileContents": "http://localhost:16000/api/profile_picture/1"
					},
					"id": "1",
					"type": "profile_picture"
				}
			} as ProfilePictureDocument<"read">),
			{ "status": RequestEnvironment.status.OK }
		)

		ProfilePictureFetcher.initialize("/api")

		const fetcher = new ProfilePictureFetcher()
		const response = await fetcher.updateFile("1", {} as FormData)

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty("url", "/api/profile_picture/1")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		expect(response).toHaveProperty(
			"body.data.fileContents",
			"http://localhost:16000/api/profile_picture/1")
	})
})
