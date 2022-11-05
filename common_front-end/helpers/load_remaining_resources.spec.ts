import { ref } from "vue"

import type { DepartmentQueryParameters } from "$/types/query"

import RequestEnvironment from "$/singletons/request_environment"
import DepartmentFetcher from "$@/fetchers/department"

import loadRemainingResource from "./load_remaining_resource"

describe("Helper: Load remaining resource", () => {
	it("should request for more", async() => {
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": [
				{}
			],
			"meta": {
				"count": 2
			}
		}), { "status": RequestEnvironment.status.OK })
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": [],
			"meta": {
				"count": 0
			}
		}), { "status": RequestEnvironment.status.OK })

		const listDocument = ref({
			"data": [],
			"meta": {
				"count": 0
			}
		})
		const fetcher = new DepartmentFetcher()
		const queryMaker = () => ({
			"filter": {
				"existence": "exists",
				"slug": ""
			},
			"page": {
				"limit": 0,
				"offset": 0
			},
			"sort": []
		} as DepartmentQueryParameters)

		await loadRemainingResource(listDocument, fetcher, queryMaker)

		expect(fetch).toHaveBeenCalledTimes(2)
	})

	it("should stop", async() => {
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": [],
			"meta": {
				"count": 0
			}
		}), { "status": RequestEnvironment.status.OK })

		const listDocument = ref({
			"data": [],
			"meta": {
				"count": 0
			}
		})
		const fetcher = new DepartmentFetcher()
		const queryMaker = () => ({
			"filter": {
				"existence": "exists",
				"slug": ""
			},
			"page": {
				"limit": 0,
				"offset": 0
			},
			"sort": []
		} as DepartmentQueryParameters)

		await loadRemainingResource(listDocument, fetcher, queryMaker)

		expect(fetch).toHaveBeenCalledTimes(1)
	})

	it("should delay", async() => {
		jest.useFakeTimers()
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": [],
			"meta": {
				"count": 0
			}
		}), { "status": RequestEnvironment.status.OK })

		const listDocument = ref({
			"data": [],
			"meta": {
				"count": 0
			}
		})
		const fetcher = new DepartmentFetcher()
		const queryMaker = () => ({
			"filter": {
				"existence": "exists",
				"slug": ""
			},
			"page": {
				"limit": 0,
				"offset": 0
			},
			"sort": []
		} as DepartmentQueryParameters)
		const delayDuration = 200
		const mockOperation = jest.fn()
		const delayer = () => new Promise<void>(resolve => {
			setTimeout(() => {
				mockOperation()
				resolve()
			}, delayDuration)
		})

		const loadingProcess = loadRemainingResource(listDocument, fetcher, queryMaker, { delayer })
		jest.advanceTimersByTime(delayDuration)
		await loadingProcess

		expect(fetch).toHaveBeenCalledTimes(1)
		expect(mockOperation).toHaveBeenCalledTimes(1)
	})

	it("should run post operations", async() => {
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": [ {} ],
			"meta": {
				"count": 2
			}
		}), { "status": RequestEnvironment.status.OK })
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": [],
			"meta": {
				"count": 0
			}
		}), { "status": RequestEnvironment.status.OK })

		const listDocument = ref({
			"data": [],
			"meta": {
				"count": 0
			}
		})
		const fetcher = new DepartmentFetcher()
		const queryMaker = () => ({
			"filter": {
				"existence": "exists",
				"slug": ""
			},
			"page": {
				"limit": 0,
				"offset": 0
			},
			"sort": []
		} as DepartmentQueryParameters)
		const mockOperation = jest.fn()
		const postOperations = () => new Promise<void>(resolve => {
			mockOperation()
			resolve()
		})

		await loadRemainingResource(listDocument, fetcher, queryMaker, { postOperations })

		expect(fetch).toHaveBeenCalledTimes(2)
		expect(mockOperation).toHaveBeenCalledTimes(1)
	})

	it("should stop manually", async() => {
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": [ {} ],
			"meta": {
				"count": 2
			}
		}), { "status": RequestEnvironment.status.OK })
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": [],
			"meta": {
				"count": 0
			}
		}), { "status": RequestEnvironment.status.OK })

		const listDocument = ref({
			"data": [],
			"meta": {
				"count": 0
			}
		})
		const fetcher = new DepartmentFetcher()
		const queryMaker = () => ({
			"filter": {
				"existence": "exists",
				"slug": ""
			},
			"page": {
				"limit": 0,
				"offset": 0
			},
			"sort": []
		} as DepartmentQueryParameters)
		const mockOperation = jest.fn()
		const postOperations = () => new Promise<void>(resolve => {
			mockOperation()
			resolve()
		})

		await loadRemainingResource(listDocument, fetcher, queryMaker, {
			"mayContinue": () => Promise.resolve(false),
			postOperations
		})

		expect(fetch).toHaveBeenCalledTimes(1)
		expect(mockOperation).toHaveBeenCalledTimes(1)
	})
})
