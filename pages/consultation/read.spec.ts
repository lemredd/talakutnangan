/* eslint-disable max-lines */
import { nextTick } from "vue"
import { mount, flushPromises } from "@vue/test-utils"

import { JSON_API_MEDIA_TYPE } from "$/types/server"
import type { DeserializedChatMessageListDocument } from "$/types/documents/chat_message"
import type {
	DeserializedConsultationDocument
} from "$/types/documents/consultation"

import { BODY_CLASSES } from "$@/constants/provided_keys"
import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"
import { CONSULTATION_LINK, CHAT_MESSAGE_LINK } from "$/constants/template_links"

import Stub from "$/singletons/stub"
import "~/setups/consultation_timer.setup"
import UserFactory from "~/factories/user"
import Factory from "~/factories/consultation"
import specializePath from "$/helpers/specialize_path"
import stringifyQuery from "$@/fetchers/stringify_query"
import ChatMessageFactory from "~/factories/chat_message"
import ChatMessageActivity from "%/models/chat_message_activity"
import UserProfileTransformer from "%/transformers/user_profile"
import ChatMessageTransformer from "%/transformers/chat_message"
import RequestEnvironment from "$/singletons/request_environment"
import ChatMessageActivityFactory from "~/factories/chat_message_activity"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"
import makeConsultationChatNamespace from "$/namespace_makers/consultation_chat"

import Page from "./read.page.vue"

describe("UI Page: Read consultation resource by ID", () => {
	it("can toggle state of consultation list", async() => {
		const OTHER_CONSULTATION_COUNT = 3
		const INITIAL_MESSAGE_COUNT = 5

		const userFactory = new UserFactory()
		const userModel = await userFactory.insertOne()
		const factory = new Factory()
		const models = await factory.insertMany(OTHER_CONSULTATION_COUNT)
		const model = await factory.insertOne()
		const allModels = [ model, ...models ]
		const allModelIterator = allModels.values()
		const chatMessageActivityFactory = new ChatMessageActivityFactory()
		const chatMessageActivityModels = await chatMessageActivityFactory
		.consultation(() => Promise.resolve(allModelIterator.next().value))
		.user(() => Promise.resolve(userModel))
		.insertMany(allModels.length)
		const chatMessageActivityModelIterator = chatMessageActivityModels.values()
		const chatMessageFactory = new ChatMessageFactory()
		const previewMessageModels = await chatMessageFactory
		.chatMessageActivity(() => Promise.resolve(chatMessageActivityModelIterator.next().value))
		.insertMany(chatMessageActivityModels.length)
		const activityOfModel = chatMessageActivityModels.find(
			chatMessageActivityModel => Number(chatMessageActivityModel.consultationID) === model.id
		) as ChatMessageActivity
		const chatMessageModels = await chatMessageFactory
		.chatMessageActivity(() => Promise.resolve(activityOfModel))
		.insertMany(INITIAL_MESSAGE_COUNT)

		const userResource = await userFactory.deserialize(
			userModel,
			{} as unknown as void,
			new UserProfileTransformer()
		)
		const resource = await factory.deserialize(model) as DeserializedConsultationDocument
		const resources = await factory.deserialize([ model, ...models ])
		const chatMessageActivityResources = await chatMessageActivityFactory
		.deserialize(chatMessageActivityModels)
		const previewMessageResources = await chatMessageFactory.deserialize(
			previewMessageModels,
			{} as unknown as void,
			new ChatMessageTransformer({ "included": [ "user", "consultation" ] })
		)
		const chatMessageResources = await chatMessageFactory.deserialize(chatMessageModels)

		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": [],
				"meta": {
					"count": 0
				}
			}),
			{ "status": RequestEnvironment.status.OK }
		)
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": [],
				"meta": {
					"count": 0
				}
			}),
			{ "status": RequestEnvironment.status.OK }
		)
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": [],
				"meta": {
					"count": 0
				}
			}),
			{ "status": RequestEnvironment.status.OK }
		)

		const wrapper = mount(Page, {
			"global": {
				"provide": {
					[BODY_CLASSES]: [],
					"pageContext": {
						"pageProps": {
							"chatMessageActivities": chatMessageActivityResources,
							"chatMessages": chatMessageResources,
							"consultation": resource,
							"consultations": resources,
							"previewMessages": previewMessageResources,
							"userProfile": userResource
						}
					}
				}
			}
		})
		const toggleListBtn = wrapper.find(".toggle-list-btn")

		expect(toggleListBtn.html()).toContain("right")

		await toggleListBtn.trigger("click")
		const consultationsList = wrapper.find(".consultations-list")
		expect(toggleListBtn.html()).toContain("left")
		expect(consultationsList.exists()).toBeTruthy()
	})

	it("should load resource by ID", async() => {
		const OTHER_CONSULTATION_COUNT = 3
		const ALL_CONSULTATION_COUNT = OTHER_CONSULTATION_COUNT + 1
		const INITIAL_MESSAGE_COUNT = 5

		const userFactory = new UserFactory()
		const userModel = await userFactory.insertOne()
		const factory = new Factory()
		const models = await factory.insertMany(OTHER_CONSULTATION_COUNT)
		const model = await factory.insertOne()
		const allModels = [ model, ...models ]
		const allModelIterator = allModels.values()
		const chatMessageActivityFactory = new ChatMessageActivityFactory()
		const chatMessageActivityModels = await chatMessageActivityFactory
		.consultation(() => Promise.resolve(allModelIterator.next().value))
		.user(() => Promise.resolve(userModel))
		.insertMany(allModels.length)
		const chatMessageActivityModelIterator = chatMessageActivityModels.values()
		const chatMessageFactory = new ChatMessageFactory()
		const previewMessageModels = await chatMessageFactory
		.chatMessageActivity(() => Promise.resolve(chatMessageActivityModelIterator.next().value))
		.insertMany(chatMessageActivityModels.length)
		const activityOfModel = chatMessageActivityModels.find(
			chatMessageActivityModel => Number(chatMessageActivityModel.consultationID) === model.id
		) as ChatMessageActivity
		const chatMessageModels = await chatMessageFactory
		.chatMessageActivity(() => Promise.resolve(activityOfModel))
		.insertMany(INITIAL_MESSAGE_COUNT)

		const userResource = await userFactory.deserialize(
			userModel,
			{} as unknown as void,
			new UserProfileTransformer()
		)
		const resource = await factory.deserialize(model) as DeserializedConsultationDocument
		const resources = await factory.deserialize([ model, ...models ])
		const chatMessageActivityResources = await chatMessageActivityFactory
		.deserialize(chatMessageActivityModels)
		const previewMessageResources = await chatMessageFactory.deserialize(
			previewMessageModels,
			{} as unknown as void,
			new ChatMessageTransformer({ "included": [ "user", "consultation" ] })
		)
		const chatMessageResources = await chatMessageFactory.deserialize(chatMessageModels)

		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": [],
				"meta": {
					"count": 0
				}
			}),
			{ "status": RequestEnvironment.status.OK }
		)
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": [],
				"meta": {
					"count": 0
				}
			}),
			{ "status": RequestEnvironment.status.OK }
		)
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": [],
				"meta": {
					"count": 0
				}
			}),
			{ "status": RequestEnvironment.status.OK }
		)

		const wrapper = mount(Page, {
			"global": {
				"provide": {
					[BODY_CLASSES]: [],
					"pageContext": {
						"pageProps": {
							"chatMessageActivities": chatMessageActivityResources,
							"chatMessages": chatMessageResources,
							"consultation": resource,
							"consultations": resources,
							"previewMessages": previewMessageResources,
							"userProfile": userResource
						}
					}
				}
			}
		})

		const chatWindow = wrapper.find(".chat-window")
		const toggleListBtn = wrapper.find(".toggle-list-btn")
		await toggleListBtn.trigger("click")
		const consultationList = wrapper.find(".consultations-list")
		await flushPromises()

		expect(consultationList.exists()).toBeTruthy()
		expect(chatWindow.exists()).toBeTruthy()

		const previousCalls = Stub.consumePreviousCalls()

		expect(previousCalls).toHaveProperty("0.functionName", "initialize")
		expect(previousCalls).toHaveProperty("0.arguments", [])
		expect(previousCalls).toHaveProperty("1.functionName", "addEventListener")
		expect(previousCalls).toHaveProperty("2.functionName", "addEventListener")
		expect(previousCalls).toHaveProperty("3.functionName", "addEventListeners")
		expect(previousCalls).toHaveProperty(
			"3.arguments.0",
			makeConsultationChatNamespace(model.id)
		)
		expect(previousCalls).toHaveProperty("3.arguments.1.create")
		expect(previousCalls).toHaveProperty("3.arguments.1.update")

		const castFetch = fetch as jest.Mock<any, any>
		expect(castFetch).toHaveBeenCalledTimes(2)
		const [ [ firstRequest ], [ secondRequest ] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "GET")
		expect(firstRequest).toHaveProperty("url", specializePath(CHAT_MESSAGE_LINK.query, {
			"query": stringifyQuery({
				"filter": {
					"chatMessageKinds": [ "file" ],
					"consultationIDs": [ model.id ],
					"existence": "exists",
					"previewMessageOnly": false
				},
				"page": {
					"limit": DEFAULT_LIST_LIMIT,
					"offset": 0
				},
				"sort": "-createdAt"
			})
		}))
		expect(firstRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(firstRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)

		expect(secondRequest).toHaveProperty("method", "GET")
		expect(secondRequest).toHaveProperty("url", specializePath(CONSULTATION_LINK.query, {
			"query": stringifyQuery({
				"filter": {
					"consultationScheduleRange": "*",
					"existence": "exists",
					"user": userModel.id
				},
				"page": {
					"limit": 10,
					"offset": ALL_CONSULTATION_COUNT
				},
				"sort": "-updatedAt"
			})
		}))
		expect(secondRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(secondRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
	})
})

describe("UI Page: Communicate with consultation resource", () => {
	it("can continue started consultation", async() => {
		jest.useFakeTimers()
		const OTHER_CONSULTATION_COUNT = 2
		const ALL_CONSULTATION_COUNT = OTHER_CONSULTATION_COUNT + 1
		const INITIAL_MESSAGE_COUNT = 2

		const userFactory = new UserFactory()
		const userModel = await userFactory.insertOne()
		const factory = new Factory()
		const models = await factory.insertMany(OTHER_CONSULTATION_COUNT)
		const model = await factory
		.startedAt(() => new Date(Date.now() - convertTimeToMilliseconds("00:03:00")))
		.finishedAt(() => null)
		.insertOne()
		const allModels = [ model, ...models ]
		const allModelIterator = allModels.values()
		const chatMessageActivityFactory = new ChatMessageActivityFactory()
		const chatMessageActivityModels = await chatMessageActivityFactory
		.consultation(() => Promise.resolve(allModelIterator.next().value))
		.user(() => Promise.resolve(userModel))
		.insertMany(allModels.length)
		const chatMessageActivityModelIterator = chatMessageActivityModels.values()
		const chatMessageFactory = new ChatMessageFactory()
		const previewMessageModels = await chatMessageFactory
		.chatMessageActivity(() => Promise.resolve(chatMessageActivityModelIterator.next().value))
		.insertMany(chatMessageActivityModels.length)
		const activityOfModel = chatMessageActivityModels.find(
			chatMessageActivityModel => Number(chatMessageActivityModel.consultationID) === model.id
		) as ChatMessageActivity
		const chatTextMessageModels = await chatMessageFactory
		.chatMessageActivity(() => Promise.resolve(activityOfModel))
		.kind(() => "text")
		.insertMany(INITIAL_MESSAGE_COUNT)

		const userResource = await userFactory.deserialize(
			userModel,
			{} as unknown as void,
			new UserProfileTransformer()
		)
		const resource = await factory.deserialize(model) as DeserializedConsultationDocument
		const resources = await factory.deserialize([ model, ...models ])
		const chatMessageActivityResources = await chatMessageActivityFactory
		.deserialize(chatMessageActivityModels)
		const previewMessageResources = await chatMessageFactory.deserialize(
			previewMessageModels,
			{} as unknown as void,
			new ChatMessageTransformer({ "included": [ "user", "consultation" ] })
		)
		const chatMessageResources = await chatMessageFactory
		.deserialize(chatTextMessageModels) as DeserializedChatMessageListDocument

		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": [],
				"meta": {
					"count": 0
				}
			}),
			{ "status": RequestEnvironment.status.OK }
		)
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": [],
				"meta": {
					"count": 0
				}
			}),
			{ "status": RequestEnvironment.status.OK }
		)
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": [],
				"meta": {
					"count": 0
				}
			}),
			{ "status": RequestEnvironment.status.OK }
		)

		const wrapper = mount(Page, {
			"global": {
				"provide": {
					[BODY_CLASSES]: [],
					"pageContext": {
						"pageProps": {
							"chatMessageActivities": chatMessageActivityResources,
							"chatMessages": chatMessageResources,
							"consultation": resource,
							"consultations": resources,
							"previewMessages": previewMessageResources,
							"userProfile": userResource
						}
					}
				}
			}
		})

		await flushPromises()
		await nextTick()

		const consultationHeader = wrapper.find(".selected-consultation-header")
		expect(consultationHeader.exists()).toBeTruthy()
		const chatEntries = wrapper.findAll(".chat-entry")
		expect(chatEntries).toHaveLength(2)
		expect(chatEntries[0].html()).toContain(chatMessageResources.data[0].data.value)
		expect(chatEntries[1].html()).toContain(chatMessageResources.data[1].data.value)

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "initialize")
		expect(previousCalls).toHaveProperty("0.arguments", [])
		expect(previousCalls).toHaveProperty("1.functionName", "addEventListener")
		expect(previousCalls).toHaveProperty("2.functionName", "addEventListener")
		expect(previousCalls).toHaveProperty("3.functionName", "addEventListeners")
		expect(previousCalls).toHaveProperty(
			"3.arguments.0",
			makeConsultationChatNamespace(model.id)
		)
		expect(previousCalls).toHaveProperty("3.arguments.1.create")
		expect(previousCalls).toHaveProperty("3.arguments.1.update")

		const castFetch = fetch as jest.Mock<any, any>
		expect(castFetch).toHaveBeenCalledTimes(2)
		const [ [ firstRequest ], [ secondRequest ] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "GET")
		expect(firstRequest).toHaveProperty("url", specializePath(CHAT_MESSAGE_LINK.query, {
			"query": stringifyQuery({
				"filter": {
					"chatMessageKinds": [ "file" ],
					"consultationIDs": [ model.id ],
					"existence": "exists",
					"previewMessageOnly": false
				},
				"page": {
					"limit": DEFAULT_LIST_LIMIT,
					"offset": 0
				},
				"sort": "-createdAt"
			})
		}))
		expect(firstRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(firstRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)

		expect(secondRequest).toHaveProperty("method", "GET")
		expect(secondRequest).toHaveProperty("url", specializePath(CONSULTATION_LINK.query, {
			"query": stringifyQuery({
				"filter": {
					"consultationScheduleRange": "*",
					"existence": "exists",
					"user": userModel.id
				},
				"page": {
					"limit": 10,
					"offset": ALL_CONSULTATION_COUNT
				},
				"sort": "-updatedAt"
			})
		}))
		expect(secondRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(secondRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)

		// End the pending finished listener
		fetchMock.mockResponseOnce("{}", { "status": RequestEnvironment.status.NO_CONTENT })
		jest.advanceTimersByTime(convertTimeToMilliseconds("00:05:00"))
	})
})
