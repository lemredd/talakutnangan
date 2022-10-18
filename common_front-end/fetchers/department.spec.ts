import { JSON_API_MEDIA_TYPE } from "$/types/server"
import type { DepartmentQueryParameters } from "$/types/query"
import stringifyQuery from "$@/fetchers/stringify_query"
import RequestEnvironment from "$/singletons/request_environment"
import DepartmentFetcher from "./department"

describe("Fetcher: Department", () => {
	it("can create resource", async() => {
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": {
				"attributes": {
					"acronym": "A",
					"fullName": "A",
					"mayAdmit": true
				},
				"id": "1",
				"type": "department"
			}
		}), { "status": RequestEnvironment.status.CREATED })

		const fetcher = new DepartmentFetcher()
		const response = await fetcher.create({
			"acronym": "A",
			"fullName": "A",
			"mayAdmit": true
		})

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/department")
		expect(request.json()).resolves.toStrictEqual({
			"data": {
				"attributes": {
					"acronym": "A",
					"fullName": "A",
					"mayAdmit": true
				},
				"type": "department"
			}
		})
		expect(response).toHaveProperty("body", {
			"data": {
				"acronym": "A",
				"fullName": "A",
				"id": "1",
				"mayAdmit": true,
				"type": "department"
			}
		})
		expect(response).toHaveProperty("status", RequestEnvironment.status.CREATED)
	})

	it("can list all resources", async() => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": [
					{
						"attributes": {
							"acronym": "A",
							"fullName": "A",
							"mayAdmit": true
						},
						"type": "department"
					}
				]
			}),
			{ "status": RequestEnvironment.status.OK }
		)

		const queryObject: DepartmentQueryParameters = {
			"filter": {
				"IDs": [],
				"existence": "exists",
				"slug": ""
			},
			"page": {
				"limit": 5,
				"offset": 0
			},
			"sort": [ "id", "name" ]
		}
		const fetcher = new DepartmentFetcher()
		const response = await fetcher.list(queryObject)

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "GET")
		expect(request).toHaveProperty("url", `/api/department?${stringifyQuery({
			...queryObject,
			"sort": queryObject.sort.join(",")
		})}`)
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(response).toHaveProperty("body.data.0.type")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
	})

	it("can update resource", async() => {
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })

		const fetcher = new DepartmentFetcher()
		const response = await fetcher.update("1", {
			"acronym": "A",
			"fullName": "A",
			"mayAdmit": true
		})

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty("url", "/api/department/1")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({
			"data": {
				"attributes": {
					"acronym": "A",
					"fullName": "A",
					"mayAdmit": true
				},
				"id": "1",
				"type": "department"
			}
		})
		expect(response).toHaveProperty("body", null)
		expect(response).toHaveProperty("status", RequestEnvironment.status.NO_CONTENT)
	})

	it("can archive resource", async() => {
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })

		const fetcher = new DepartmentFetcher()
		const response = await fetcher.archive([ "1" ])

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "DELETE")
		expect(request).toHaveProperty("url", "/api/department")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({
			"data": [
				{
					"id": "1",
					"type": "department"
				}
			]
		})
		expect(response).toHaveProperty("body", null)
		expect(response).toHaveProperty("status", RequestEnvironment.status.NO_CONTENT)
	})

	it("can restore resource", async() => {
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })

		const fetcher = new DepartmentFetcher()
		const response = await fetcher.restore([ "2" ])

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty("url", "/api/department")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({
			"data": [
				{
					"id": "2",
					"type": "department"
				}
			]
		})
		expect(response).toHaveProperty("body", null)
		expect(response).toHaveProperty("status", RequestEnvironment.status.NO_CONTENT)
	})
})
