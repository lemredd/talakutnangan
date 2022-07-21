import RequestEnvironment from "$/helpers/request_environment"
import { JSON_API_MEDIA_TYPE } from "$/types/server"
import DepartmentFetcher from "./department"

describe("Communicator: Department", () => {
	it("can create resource", async () => {
		fetchMock.mockResponseOnce("{}", { status: RequestEnvironment.status.NO_CONTENT })

		const response = await DepartmentFetcher.create({
			fullName: "A",
			acronym: "A",
			mayAdmit: true
		})

		const request = (fetch as jest.Mock<any, any>).mock.calls[0][0]
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/department/create")
		expect(request.json()).resolves.toStrictEqual({
			data: {
				type: "department",
				attributes: {
					fullName: "A",
					acronym: "A",
					mayAdmit: true
				}
			}
		})
		expect(response).toHaveProperty("body", {})
		expect(response).toHaveProperty("status", RequestEnvironment.status.NO_CONTENT)
	})

	it("can list all resources", async () => {
		fetchMock.mockResponseOnce(JSON.stringify({
			data: [
				{
					type: "department",
					attributes: {
						fullName: "A",
						acronym: "A",
						mayAdmit: true
					}
				}
			]
		}),
		{ status: RequestEnvironment.status.OK })

		const response = await DepartmentFetcher.list({})

		const request = (fetch as jest.Mock<any, any>).mock.calls[0][0]
		expect(request).toHaveProperty("method", "GET")
		expect(request).toHaveProperty("url", "/api/department/list")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(response).toHaveProperty("body.data.0.type")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
	})

	it("can update resource", async () => {
		fetchMock.mockResponseOnce("{}", { status: RequestEnvironment.status.NO_CONTENT })

		const response = await DepartmentFetcher.update(1, { name: "A" })

		const request = (fetch as jest.Mock<any, any>).mock.calls[0][0]
		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty("url", "/api/department/update/1")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({
			data: {
				type: "department",
				id: 1,
				attributes: {
					name: "A"
				}
			}
		})
		expect(response).toHaveProperty("body", {})
		expect(response).toHaveProperty("status", RequestEnvironment.status.NO_CONTENT)
	})

	it("can archive resource", async () => {
		fetchMock.mockResponseOnce("{}", { status: RequestEnvironment.status.NO_CONTENT })

		const response = await DepartmentFetcher.archive([ 1 ])

		const request = (fetch as jest.Mock<any, any>).mock.calls[0][0]
		expect(request).toHaveProperty("method", "DELETE")
		expect(request).toHaveProperty("url", "/api/department/archive")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({
			data: [
				{ type: "department", id: 1 }
			]
		})
		expect(response).toHaveProperty("body", {})
		expect(response).toHaveProperty("status", RequestEnvironment.status.NO_CONTENT)
	})

	it("can restore resource", async () => {
		fetchMock.mockResponseOnce("{}", { status: RequestEnvironment.status.NO_CONTENT })

		const response = await DepartmentFetcher.restore([ 2 ])

		const request = (fetch as jest.Mock<any, any>).mock.calls[0][0]
		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty("url", "/api/department/restore")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({
			data: [
				{ type: "department", id: 2 }
			]
		})
		expect(response).toHaveProperty("body", {})
		expect(response).toHaveProperty("status", RequestEnvironment.status.NO_CONTENT)
	})
})
