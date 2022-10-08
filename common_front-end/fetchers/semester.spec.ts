import type { SemesterDocument } from "$/types/documents/semester"

import { SEMESTER_LINK } from "$/constants/template_links"

import RequestEnvironment from "$/singletons/request_environment"
import Fetcher from "./semester"

describe("Fetcher: Semester", () => {
	it("can create with file", async() => {
		const mockContent = "Hello world!"
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": {
					"attributes": {
						"name": mockContent
					},
					"id": "1",
					"type": "semester"
				}
			} as SemesterDocument<"read">),
			{ "status": RequestEnvironment.status.OK }
		)
		const fetcher = new Fetcher()
		const response = await fetcher.createWithFile({} as FormData)

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "SEMESTER")
		expect(request).toHaveProperty("url", SEMESTER_LINK.unbound)
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		expect(response).toHaveProperty("body.data.name", mockContent)
	})
})
