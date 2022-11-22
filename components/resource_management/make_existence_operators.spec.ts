import { ref, watch } from "vue"

import type { Existence } from "$/types/query"
import type { DeserializedUserResource, DeserializedUserListDocument } from "$/types/documents/user"

import Fetcher from "$@/fetchers/user"
import RequestEnvironment from "$/singletons/request_environment"

import helper from "./make_existence_operators"

describe("Helper: Make existence operators", () => {
	it("should not reset offset", async() => {
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		const targetID = "1"
		const otherUserID = "2"
		const list = ref<DeserializedUserListDocument>({
			"data": [
				{
					"deletedAt": null,
					"id": targetID,
					"name": "A",
					"type": "user"
				} as DeserializedUserResource,
				{
					"deletedAt": null,
					"id": otherUserID,
					"name": "B",
					"type": "user"
				} as DeserializedUserResource
			],
			"meta": {
				"count": 0
			}
		})
		const fetcher = new Fetcher()
		const existence = ref<Existence>("exists")
		const offset = ref<number>(1)
		const selectedIDs = ref<string[]>([])
		const isLoaded = ref<boolean>(true)
		const receivedErrors = ref<string[]>([])

		const listStates = jest.fn()
		watch(list, listStates)
		const offsetStates = jest.fn()
		watch(offset, offsetStates)
		const selectedIDStates = jest.fn()
		watch(selectedIDs, selectedIDStates)
		const isLoadedStates = jest.fn()
		watch(isLoaded, isLoadedStates)

		const { archive } = helper(list, fetcher, {
			existence,
			offset
		}, selectedIDs, {
			isLoaded,
			receivedErrors
		})
		await archive(targetID)

		expect(fetch).toHaveBeenCalledTimes(1)
		expect(listStates).toHaveProperty("mock.calls.0.0.data.0.id", otherUserID)
		expect(listStates).not.toHaveProperty("mock.calls.0.0.data.1")
		expect(offsetStates).not.toHaveProperty("mock.calls.0.0")
		expect(selectedIDStates).toHaveProperty("mock.calls.0.0", [])
		expect(isLoadedStates).toHaveProperty("mock.calls.0.0", false)
		expect(isLoadedStates).toHaveProperty("mock.calls.0.1", true)
	})

	it("should not reset offset even when ID is pre-selected", async() => {
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		const targetID = "1"
		const otherUserID = "2"
		const list = ref<DeserializedUserListDocument>({
			"data": [
				{
					"deletedAt": null,
					"id": targetID,
					"name": "A",
					"type": "user"
				} as DeserializedUserResource,
				{
					"deletedAt": null,
					"id": otherUserID,
					"name": "B",
					"type": "user"
				} as DeserializedUserResource
			],
			"meta": {
				"count": 0
			}
		})
		const fetcher = new Fetcher()
		const existence = ref<Existence>("exists")
		const offset = ref<number>(1)
		const selectedIDs = ref<string[]>([ targetID ])
		const isLoaded = ref<boolean>(true)
		const receivedErrors = ref<string[]>([])

		const listStates = jest.fn()
		watch(list, listStates)
		const offsetStates = jest.fn()
		watch(offset, offsetStates)
		const selectedIDStates = jest.fn()
		watch(selectedIDs, selectedIDStates)
		const isLoadedStates = jest.fn()
		watch(isLoaded, isLoadedStates)

		const { archive } = helper(list, fetcher, {
			existence,
			offset
		}, selectedIDs, {
			isLoaded,
			receivedErrors
		})
		await archive(targetID)

		expect(fetch).toHaveBeenCalledTimes(1)
		expect(listStates).toHaveProperty("mock.calls.0.0.data.0.id", otherUserID)
		expect(listStates).not.toHaveProperty("mock.calls.0.0.data.1")
		expect(offsetStates).not.toHaveProperty("mock.calls.0.0")
		expect(selectedIDStates).toHaveProperty("mock.calls.0.0", [])
		expect(isLoadedStates).toHaveProperty("mock.calls.0.0", false)
		expect(isLoadedStates).toHaveProperty("mock.calls.0.1", true)
	})

	it("should decrease offset", async() => {
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		const targetID = "1"
		const list = ref<DeserializedUserListDocument>({
			"data": [
				{
					"deletedAt": null,
					"id": targetID,
					"name": "A",
					"type": "user"
				} as DeserializedUserResource
			],
			"meta": {
				"count": 0
			}
		})
		const fetcher = new Fetcher()
		const existence = ref<Existence>("exists")
		const offset = ref<number>(2)
		const selectedIDs = ref<string[]>([])
		const isLoaded = ref<boolean>(true)
		const receivedErrors = ref<string[]>([])

		const listStates = jest.fn()
		watch(list, listStates)
		const offsetStates = jest.fn()
		watch(offset, offsetStates)
		const selectedIDStates = jest.fn()
		watch(selectedIDs, selectedIDStates)
		const isLoadedStates = jest.fn()
		watch(isLoaded, isLoadedStates)

		const { archive } = helper(list, fetcher, {
			existence,
			offset
		}, selectedIDs, {
			isLoaded,
			receivedErrors
		})
		await archive(targetID)

		expect(fetch).toHaveBeenCalledTimes(1)
		expect(listStates).not.toHaveProperty("mock.calls.0.0.data.0")
		expect(offsetStates).toHaveProperty("mock.calls.0.0", 1)
		expect(selectedIDStates).toHaveProperty("mock.calls.0.0", [])
		expect(isLoadedStates).toHaveProperty("mock.calls.0.0", false)
		expect(isLoadedStates).toHaveProperty("mock.calls.0.1", true)
	})

	it("should decrease offset even when ID is pre-selected", async() => {
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		const targetID = "1"
		const list = ref<DeserializedUserListDocument>({
			"data": [
				{
					"deletedAt": null,
					"id": targetID,
					"name": "A",
					"type": "user"
				} as DeserializedUserResource
			],
			"meta": {
				"count": 0
			}
		})
		const fetcher = new Fetcher()
		const existence = ref<Existence>("exists")
		const offset = ref<number>(2)
		const selectedIDs = ref<string[]>([ targetID ])
		const isLoaded = ref<boolean>(true)
		const receivedErrors = ref<string[]>([])

		const listStates = jest.fn()
		watch(list, listStates)
		const offsetStates = jest.fn()
		watch(offset, offsetStates)
		const selectedIDStates = jest.fn()
		watch(selectedIDs, selectedIDStates)
		const isLoadedStates = jest.fn()
		watch(isLoaded, isLoadedStates)

		const { archive } = helper(list, fetcher, {
			existence,
			offset
		}, selectedIDs, {
			isLoaded,
			receivedErrors
		})
		await archive(targetID)

		expect(fetch).toHaveBeenCalledTimes(1)
		expect(listStates).not.toHaveProperty("mock.calls.0.0.data.0")
		expect(offsetStates).toHaveProperty("mock.calls.0.0", 1)
		expect(selectedIDStates).toHaveProperty("mock.calls.0.0", [])
		expect(isLoadedStates).toHaveProperty("mock.calls.0.0", false)
		expect(isLoadedStates).toHaveProperty("mock.calls.0.1", true)
	})

	it("should reset offset", async() => {
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		const targetID = "1"
		const list = ref<DeserializedUserListDocument>({
			"data": [
				{
					"deletedAt": null,
					"id": targetID,
					"name": "A",
					"type": "user"
				} as DeserializedUserResource
			],
			"meta": {
				"count": 0
			}
		})
		const fetcher = new Fetcher()
		const existence = ref<Existence>("exists")
		const offset = ref<number>(1)
		const selectedIDs = ref<string[]>([])
		const isLoaded = ref<boolean>(true)
		const receivedErrors = ref<string[]>([])

		const listStates = jest.fn()
		watch(list, listStates)
		const offsetStates = jest.fn()
		watch(offset, offsetStates)
		const selectedIDStates = jest.fn()
		watch(selectedIDs, selectedIDStates)
		const isLoadedStates = jest.fn()
		watch(isLoaded, isLoadedStates)

		const { archive } = helper(list, fetcher, {
			existence,
			offset
		}, selectedIDs, {
			isLoaded,
			receivedErrors
		})
		await archive(targetID)

		expect(fetch).toHaveBeenCalledTimes(1)
		expect(listStates).not.toHaveProperty("mock.calls.0.0.data.0")
		expect(offsetStates).toHaveProperty("mock.calls.0.0", 0)
		expect(selectedIDStates).toHaveProperty("mock.calls.0.0", [])
		expect(isLoadedStates).toHaveProperty("mock.calls.0.0", false)
		expect(isLoadedStates).toHaveProperty("mock.calls.0.1", true)
	})

	it("should reset offset even when ID is pre-selected", async() => {
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		const targetID = "1"
		const list = ref<DeserializedUserListDocument>({
			"data": [
				{
					"deletedAt": null,
					"id": targetID,
					"name": "A",
					"type": "user"
				} as DeserializedUserResource
			],
			"meta": {
				"count": 0
			}
		})
		const fetcher = new Fetcher()
		const existence = ref<Existence>("exists")
		const offset = ref<number>(1)
		const selectedIDs = ref<string[]>([ targetID ])
		const isLoaded = ref<boolean>(true)
		const receivedErrors = ref<string[]>([])

		const listStates = jest.fn()
		watch(list, listStates)
		const offsetStates = jest.fn()
		watch(offset, offsetStates)
		const selectedIDStates = jest.fn()
		watch(selectedIDs, selectedIDStates)
		const isLoadedStates = jest.fn()
		watch(isLoaded, isLoadedStates)

		const { archive } = helper(list, fetcher, {
			existence,
			offset
		}, selectedIDs, {
			isLoaded,
			receivedErrors
		})
		await archive(targetID)

		expect(fetch).toHaveBeenCalledTimes(1)
		expect(listStates).not.toHaveProperty("mock.calls.0.0.data.0")
		expect(offsetStates).toHaveProperty("mock.calls.0.0", 0)
		expect(selectedIDStates).toHaveProperty("mock.calls.0.0", [])
		expect(isLoadedStates).toHaveProperty("mock.calls.0.0", false)
		expect(isLoadedStates).toHaveProperty("mock.calls.0.1", true)
	})

	it("should not reset list", async() => {
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		const targetID = "1"
		const otherUserID = "2"
		const list = ref<DeserializedUserListDocument>({
			"data": [
				{
					"deletedAt": new Date(),
					"id": targetID,
					"name": "A",
					"type": "user"
				} as DeserializedUserResource,
				{
					"deletedAt": null,
					"id": otherUserID,
					"name": "B",
					"type": "user"
				} as DeserializedUserResource
			],
			"meta": {
				"count": 0
			}
		})
		const fetcher = new Fetcher()
		const existence = ref<Existence>("*")
		const offset = ref<number>(1)
		const selectedIDs = ref<string[]>([])
		const isLoaded = ref<boolean>(true)
		const receivedErrors = ref<string[]>([])

		const listStates = jest.fn()
		watch(list, listStates)
		const offsetStates = jest.fn()
		watch(offset, offsetStates)
		const selectedIDStates = jest.fn()
		watch(selectedIDs, selectedIDStates)
		const isLoadedStates = jest.fn()
		watch(isLoaded, isLoadedStates)

		const { restore } = helper(list, fetcher, {
			existence,
			offset
		}, selectedIDs, {
			isLoaded,
			receivedErrors
		})
		await restore(targetID)

		expect(fetch).toHaveBeenCalledTimes(1)
		expect(listStates).toHaveProperty("mock.calls.0.0.data.0.deletedAt", null)
		expect(listStates).toHaveProperty("mock.calls.0.0.data.1")
		expect(offsetStates).not.toHaveProperty("mock.calls.0.0")
		expect(selectedIDStates).toHaveProperty("mock.calls.0.0", [])
		expect(isLoadedStates).toHaveProperty("mock.calls.0.0", false)
		expect(isLoadedStates).toHaveProperty("mock.calls.0.1", true)
	})

	it("should not reset list even when ID is pre-selected", async() => {
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		const targetID = "1"
		const otherUserID = "2"
		const list = ref<DeserializedUserListDocument>({
			"data": [
				{
					"deletedAt": new Date(),
					"id": targetID,
					"name": "A",
					"type": "user"
				} as DeserializedUserResource,
				{
					"deletedAt": null,
					"id": otherUserID,
					"name": "B",
					"type": "user"
				} as DeserializedUserResource
			],
			"meta": {
				"count": 0
			}
		})
		const fetcher = new Fetcher()
		const existence = ref<Existence>("*")
		const offset = ref<number>(1)
		const selectedIDs = ref<string[]>([ targetID ])
		const isLoaded = ref<boolean>(true)
		const receivedErrors = ref<string[]>([])

		const listStates = jest.fn()
		watch(list, listStates)
		const offsetStates = jest.fn()
		watch(offset, offsetStates)
		const selectedIDStates = jest.fn()
		watch(selectedIDs, selectedIDStates)
		const isLoadedStates = jest.fn()
		watch(isLoaded, isLoadedStates)

		const { restore } = helper(list, fetcher, {
			existence,
			offset
		}, selectedIDs, {
			isLoaded,
			receivedErrors
		})
		await restore(targetID)

		expect(fetch).toHaveBeenCalledTimes(1)
		expect(listStates).toHaveProperty("mock.calls.0.0.data.0.deletedAt", null)
		expect(listStates).toHaveProperty("mock.calls.0.0.data.1")
		expect(offsetStates).not.toHaveProperty("mock.calls.0.0")
		expect(selectedIDStates).toHaveProperty("mock.calls.0.0", [])
		expect(isLoadedStates).toHaveProperty("mock.calls.0.0", false)
		expect(isLoadedStates).toHaveProperty("mock.calls.0.1", true)
	})
})
