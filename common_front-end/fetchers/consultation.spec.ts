import type { TimeSumQueryParameters } from "$/types/query"

import {
	READ_TIME_SUM_PER_STUDENT,
	READ_TIME_SUM_PER_WEEK,
	READ_TIME_SUM_FOR_CONSOLIDATION,
	READ_GENERATED_RTC_TOKEN
} from "$/constants/template_links"

import specializePath from "$/helpers/specialize_path"
import stringifyQuery from "$@/fetchers/stringify_query"
import RequestEnvironment from "$/singletons/request_environment"

import Fetcher from "./consultation"

describe("Fetcher: Consultation", () => {
	it("can read summary per student", async() => {
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": {
				"attributes": {
					"email": "A@example.com",
					"name": "A"
				},
				"id": "2",
				"meta": {},
				"type": "user"
			}
		}), { "status": RequestEnvironment.status.OK })

		const query: TimeSumQueryParameters = {
			"filter": {
				"dateTimeRange": {
					"begin": new Date(),
					"end": new Date()
				},
				"existence": "*",
				"user": "1"
			},
			"page": {
				"limit": 1,
				"offset": 0
			},
			"sort": [ "-name" ]
		}
		const fetcher = new Fetcher()
		const response = await fetcher.readTimeSumPerStudent(query)

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "GET")
		expect(request).toHaveProperty("url", specializePath(READ_TIME_SUM_PER_STUDENT, {
			"query": stringifyQuery({
				...query,
				"sort": query.sort.join(",")
			})
		}))
		expect(response).toHaveProperty("body", {
			"data": {
				"email": "A@example.com",
				"id": "2",
				"meta": {},
				"name": "A",
				"type": "user"
			}
		})
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
	})

	it("can read summary per week", async() => {
		fetchMock.mockResponseOnce(JSON.stringify({
			"meta": {}
		}), { "status": RequestEnvironment.status.OK })

		const query: TimeSumQueryParameters = {
			"filter": {
				"dateTimeRange": {
					"begin": new Date(),
					"end": new Date()
				},
				"existence": "*",
				"user": "1"
			},
			"page": {
				"limit": 1,
				"offset": 0
			},
			"sort": [ "-name" ]
		}
		const fetcher = new Fetcher()
		const response = await fetcher.readTimeSumPerWeek(query)

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "GET")
		expect(request).toHaveProperty("url", specializePath(READ_TIME_SUM_PER_WEEK, {
			"query": stringifyQuery({
				...query,
				"sort": query.sort.join(",")
			})
		}))
		expect(response).toHaveProperty("body", {
			"meta": {}
		})
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
	})

	it("can read summary for consolidation", async() => {
		fetchMock.mockResponseOnce(JSON.stringify({
			"meta": {}
		}), { "status": RequestEnvironment.status.OK })

		const query: TimeSumQueryParameters = {
			"filter": {
				"dateTimeRange": {
					"begin": new Date(),
					"end": new Date()
				},
				"existence": "*",
				"user": "1"
			},
			"page": {
				"limit": 1,
				"offset": 0
			},
			"sort": [ "-name" ]
		}
		const fetcher = new Fetcher()
		const response = await fetcher.readTimeSumForConsolidation(query)

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "GET")
		expect(request).toHaveProperty("url", specializePath(READ_TIME_SUM_FOR_CONSOLIDATION, {
			"query": stringifyQuery({
				...query,
				"sort": query.sort.join(",")
			})
		}))
		expect(response).toHaveProperty("body", {
			"meta": {}
		})
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
	})

	it("can read generated token", async() => {
		fetchMock.mockResponseOnce(JSON.stringify({
			"meta": {}
		}), { "status": RequestEnvironment.status.OK })

		const consultationID = "1"
		const channelName = "call"
		const chatMessageActivityID = "2"
		const fetcher = new Fetcher()
		const response = await fetcher.generateToken(
			consultationID,
			channelName,
			chatMessageActivityID
		)

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "GET")
		expect(request).toHaveProperty("url", specializePath(READ_GENERATED_RTC_TOKEN, {
			channelName,
			"id": consultationID,
			"uid": chatMessageActivityID
		}))
		expect(response).toHaveProperty("body", {
			"meta": {}
		})
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
	})
})
