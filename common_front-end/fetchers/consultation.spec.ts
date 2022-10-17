import specializePath from "$/helpers/specialize_path"
import RequestEnvironment from "$/singletons/request_environment"
import { GENERATE_CONSULTATION_AS_PDF_LINK } from "$/constants/template_links"
import Fetcher from "./consultation"

describe("Fetcher: Consultation", () => {
	it("can request to generate PDF version of consultation", async() => {
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": {
				"attributes": {
					"token": "1234"
				},
				"id": "2",
				"type": "asynchronous_file"
			}
		}), { "status": RequestEnvironment.status.ACCEPTED })

		const consultationID = "1"
		const fetcher = new Fetcher()
		const response = await fetcher.requestAsPDF(consultationID)

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", specializePath(GENERATE_CONSULTATION_AS_PDF_LINK, {
			"id": consultationID
		}))
		expect(await request.json()).toStrictEqual({
			"data": {
				"id": consultationID,
				"type": "consultation"
			}
		})
		expect(response).toHaveProperty("body", {
			"data": {
				"id": "2",
				"token": "1234",
				"type": "asynchronous_file"
			}
		})
		expect(response).toHaveProperty("status", RequestEnvironment.status.ACCEPTED)
	})
})
