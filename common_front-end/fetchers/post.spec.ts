import { COUNT_COMMENTS, UPDATE_TAG_OF_POST_LINK } from "$/constants/template_links"

import specializePath from "$/helpers/specialize_path"
import stringifyQuery from "$@/fetchers/stringify_query"
import RequestEnvironment from "$/singletons/request_environment"

import Fetcher from "./post"

describe("Fetcher: Post", () => {
	it("can get comment count", async() => {
		fetchMock.mockResponseOnce(
			JSON.stringify({ "data": [] }),
			{ "status": RequestEnvironment.status.OK }
		)
		const commentIDs = [ "1" ]
		const fetcher = new Fetcher()

		const response = await fetcher.countComments(commentIDs)

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "GET")
		expect(request).toHaveProperty("url", specializePath(COUNT_COMMENTS, {
			"query": stringifyQuery({
				"filter": {
					"IDs": commentIDs
				}
			})
		}))
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
	})

	it("can update attached tags", async() => {
		fetchMock.mockResponseOnce(
			"",
			{ "status": RequestEnvironment.status.NO_CONTENT }
		)
		const postID = "1"
		const tagIDs = [ "1" ]
		const fetcher = new Fetcher()

		const response = await fetcher.updateAttachedTags(postID, tagIDs)

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty("url", specializePath(UPDATE_TAG_OF_POST_LINK, {
			"id": postID
		}))
		expect(response).toHaveProperty("status", RequestEnvironment.status.NO_CONTENT)
	})
})
