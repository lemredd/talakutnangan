/* eslint-disable max-lines */
import { nextTick } from "vue"
import { mount, flushPromises } from "@vue/test-utils"

import { JSON_API_MEDIA_TYPE } from "$/types/server"
import type { ChatMessageQueryParameters } from "$/types/query"
import type { DeserializedConsultationDocument } from "$/types/documents/consultation"
import type {
	ChatMessageDocument,
	DeserializedChatMessageDocument,
	DeserializedChatMessageListDocument
} from "$/types/documents/chat_message"

import Stub from "$/singletons/stub"
import Socket from "$@/external/socket"
import UserFactory from "~/factories/user"
import Factory from "~/factories/consultation"
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

describe("UI Page: Read resource by ID", () => {
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

		const userResource = userFactory.deserialize(
			userModel,
			{} as unknown as void,
			new UserProfileTransformer()
		)
		const resource = factory.deserialize(model) as DeserializedConsultationDocument
		const resources = factory.deserialize([ model, ...models ])
		const chatMessageActivityResources = chatMessageActivityFactory
		.deserialize(chatMessageActivityModels)
		const previewMessageResources = chatMessageFactory.deserialize(
			previewMessageModels,
			{} as unknown as void,
			new ChatMessageTransformer({ "included": [ "user", "consultation" ] })
		)
		const chatMessageResources = chatMessageFactory.deserialize(chatMessageModels)

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

		const consultationList = wrapper.find(".consultations-list")
		const chatWindow = wrapper.find(".chat-window")
		await flushPromises()

		expect(consultationList.exists()).toBeTruthy()
		expect(chatWindow.exists()).toBeTruthy()

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "initialize")
		expect(previousCalls).toHaveProperty("0.arguments", [])
		expect(previousCalls).toHaveProperty("1.functionName", "addEventListeners")
		expect(previousCalls).toHaveProperty(
			"1.arguments.0",
			makeConsultationChatNamespace(model.id)
		)
		expect(previousCalls).toHaveProperty("1.arguments.1.create")
		expect(previousCalls).toHaveProperty("1.arguments.1.update")

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ firstRequest ], [ secondRequest ] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "GET")
		expect(firstRequest).toHaveProperty("url", `/api/consultation?${
			stringifyQuery({
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
		}`)
		expect(firstRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(firstRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(secondRequest).toHaveProperty("method", "GET")
		expect(secondRequest).toHaveProperty("url", `/api/chat_message?${
			stringifyQuery({
				"filter": {
					"chatMessageKinds": [ "text", "status" ],
					"consultationIDs": [ resource.data.id ],
					"existence": "exists"
				},
				"page": {
					"limit": 10,
					"offset": INITIAL_MESSAGE_COUNT
				},
				"sort": [ "-createdAt" ]
			} as ChatMessageQueryParameters)
		}`)
		expect(secondRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(secondRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
	})

	it("can visit resource by ID", async() => {
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

		const userResource = userFactory.deserialize(
			userModel,
			{} as unknown as void,
			new UserProfileTransformer()
		)
		const resource = factory.deserialize(model) as DeserializedConsultationDocument
		const resources = factory.deserialize([ model, ...models ])
		const chatMessageActivityResources = chatMessageActivityFactory
		.deserialize(chatMessageActivityModels)
		const previewMessageResources = chatMessageFactory.deserialize(
			previewMessageModels,
			{} as unknown as void,
			new ChatMessageTransformer({ "included": [ "user", "consultation" ] })
		)
		const chatMessageResources = chatMessageFactory.deserialize(chatMessageModels)

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
		const consultationListItem = wrapper.find(".consultation:nth-child(2)")

		await consultationListItem.trigger("click")
		await flushPromises()

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "initialize")
		expect(previousCalls).toHaveProperty("0.arguments", [])
		expect(previousCalls).toHaveProperty("1.functionName", "addEventListeners")
		expect(previousCalls).toHaveProperty(
			"1.arguments.0",
			makeConsultationChatNamespace(model.id)
		)
		expect(previousCalls).toHaveProperty("1.arguments.1.create")
		expect(previousCalls).toHaveProperty("1.arguments.1.update")
		expect(previousCalls).toHaveProperty("2.functionName", "assignPath")
		expect(previousCalls).toHaveProperty("2.arguments", [ `/consultation/${models[0].id}` ])

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ firstRequest ], [ secondRequest ] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "GET")
		expect(firstRequest).toHaveProperty("url", `/api/consultation?${
			stringifyQuery({
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
		}`)
		expect(firstRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(firstRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(secondRequest).toHaveProperty("method", "GET")
		expect(secondRequest).toHaveProperty("url", `/api/chat_message?${
			stringifyQuery({
				"filter": {
					"chatMessageKinds": [ "text", "status" ],
					"consultationIDs": [ resource.data.id ],
					"existence": "exists"
				},
				"page": {
					"limit": 10,
					"offset": INITIAL_MESSAGE_COUNT
				},
				"sort": [ "-createdAt" ]
			} as ChatMessageQueryParameters)
		}`)
		expect(secondRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(secondRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
	})

	it("can insert messages from socket", async() => {
		const OTHER_CONSULTATION_COUNT = 2
		const ALL_CONSULTATION_COUNT = OTHER_CONSULTATION_COUNT + 1
		const INITIAL_MESSAGE_COUNT = 2

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
		const chatTextMessageModels = await chatMessageFactory
		.chatMessageActivity(() => Promise.resolve(activityOfModel))
		.kind(() => "text")
		.insertMany(INITIAL_MESSAGE_COUNT)
		const sampleChatTextMessageModel = await chatMessageFactory
		.chatMessageActivity(() => Promise.resolve(activityOfModel))
		.kind(() => "text")
		.insertOne()

		const userResource = userFactory.deserialize(
			userModel,
			{} as unknown as void,
			new UserProfileTransformer()
		)
		const resource = factory.deserialize(model) as DeserializedConsultationDocument
		const resources = factory.deserialize([ model, ...models ])
		const chatMessageActivityResources = chatMessageActivityFactory
		.deserialize(chatMessageActivityModels)
		const previewMessageResources = chatMessageFactory.deserialize(
			previewMessageModels,
			{} as unknown as void,
			new ChatMessageTransformer({ "included": [ "user", "consultation" ] })
		)
		const chatMessageResources = chatMessageFactory
		.deserialize(chatTextMessageModels) as DeserializedChatMessageListDocument
		const sampleChatTextMessageResource = chatMessageFactory
		.deserialize(sampleChatTextMessageModel) as DeserializedChatMessageDocument
		const sampleUpdatedChatMessageResource = await chatMessageFactory
		.chatMessageActivity(() => Promise.resolve(activityOfModel))
		.deserializedOne()
		const consultationChatNamespace = makeConsultationChatNamespace(model.id)

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

		Socket.emitMockEvent(consultationChatNamespace, "create", sampleChatTextMessageResource)
		await nextTick()
		Socket.emitMockEvent(consultationChatNamespace, "update", {
			"data": {
				"attributes": {
					"createdAt": chatMessageResources.data[0].createdAt.toJSON(),
					"data": sampleUpdatedChatMessageResource.data.data,
					"kind": chatMessageResources.data[0].kind,
					"updatedAt": new Date().toJSON()
				},
				"id": chatMessageResources.data[0].id,
				"relationships": {
					"user": sampleChatTextMessageResource.data.user
				},
				"type": "chat_message"
			}
		} as ChatMessageDocument)
		await nextTick()
		await flushPromises()

		const chatEntries = wrapper.findAll(".chat-entry")
		expect(chatEntries).toHaveLength(3)
		expect(chatEntries[0].html()).toContain(sampleUpdatedChatMessageResource.data.data.value)
		expect(chatEntries[1].html()).toContain(chatMessageResources.data[1].data.value)
		expect(chatEntries[2].html()).toContain(sampleChatTextMessageResource.data.data.value)

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "initialize")
		expect(previousCalls).toHaveProperty("0.arguments", [])
		expect(previousCalls).toHaveProperty("1.functionName", "addEventListeners")
		expect(previousCalls).toHaveProperty(
			"1.arguments.0",
			makeConsultationChatNamespace(model.id)
		)
		expect(previousCalls).toHaveProperty("1.arguments.1.create")
		expect(previousCalls).toHaveProperty("1.arguments.1.update")

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ firstRequest ], [ secondRequest ] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "GET")
		expect(firstRequest).toHaveProperty("url", `/api/consultation?${
			stringifyQuery({
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
		}`)
		expect(firstRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(firstRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(secondRequest).toHaveProperty("method", "GET")
		expect(secondRequest).toHaveProperty("url", `/api/chat_message?${
			stringifyQuery({
				"filter": {
					"chatMessageKinds": [ "text", "status" ],
					"consultationIDs": [ resource.data.id ],
					"existence": "exists"
				},
				"page": {
					"limit": 10,
					"offset": INITIAL_MESSAGE_COUNT + 1
				},
				"sort": [ "-createdAt" ]
			} as ChatMessageQueryParameters)
		}`)
		expect(secondRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(secondRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
	})

	it("can start consultation", async() => {
		const OTHER_CONSULTATION_COUNT = 3
		const ALL_CONSULTATION_COUNT = OTHER_CONSULTATION_COUNT + 1
		const INITIAL_MESSAGE_COUNT = 5

		const userFactory = new UserFactory()
		const userModel = await userFactory.insertOne()
		const factory = new Factory()
		const models = await factory.insertMany(OTHER_CONSULTATION_COUNT)
		const model = await factory.startedAt(() => null).finishedAt(() => null).insertOne()
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
		.insertMany(INITIAL_MESSAGE_COUNT)
		const chatStatusMessageModel = await chatMessageFactory
		.chatMessageActivity(() => Promise.resolve(activityOfModel))
		.kind(() => "status")
		.insertOne()

		const userResource = userFactory.deserialize(
			userModel,
			{} as unknown as void,
			new UserProfileTransformer()
		)
		const resource = factory.deserialize(model) as DeserializedConsultationDocument
		const resources = factory.deserialize([ model, ...models ])
		const chatMessageActivityResources = chatMessageActivityFactory
		.deserialize(chatMessageActivityModels)
		const previewMessageResources = chatMessageFactory.deserialize(
			previewMessageModels,
			{} as unknown as void,
			new ChatMessageTransformer({ "included": [ "user", "consultation" ] })
		)
		const chatTextMessageResources = chatMessageFactory.deserialize(chatTextMessageModels)
		const chatStatusMessageResource = chatMessageFactory.deserialize(chatStatusMessageModel)
		const consultationChatNamespace = makeConsultationChatNamespace(model.id)

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
		fetchMock.mockResponseOnce("{}", { "status": RequestEnvironment.status.NO_CONTENT })

		jest.useRealTimers()
		const wrapper = mount(Page, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"chatMessageActivities": chatMessageActivityResources,
							"chatMessages": chatTextMessageResources,
							"consultation": resource,
							"consultations": resources,
							"previewMessages": previewMessageResources,
							"userProfile": userResource
						}
					}
				}
			}
		})
		const startButton = wrapper.find(".user-controls .start")

		const SLEEP_DURATION = 1500
		await new Promise<void>(resolve => {
			setTimeout(() => resolve(), SLEEP_DURATION)
		})
		await flushPromises()
		await startButton.trigger("click")
		await flushPromises()
		await nextTick()
		Socket.emitMockEvent(consultationChatNamespace, "create", chatStatusMessageResource)
		await nextTick()
		await flushPromises()
		const messageBox = wrapper.find(".user-controls .message-box")

		expect(messageBox.exists()).toBeTruthy()
		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "initialize")
		expect(previousCalls).toHaveProperty("0.arguments", [])
		expect(previousCalls).toHaveProperty("1.functionName", "addEventListeners")
		expect(previousCalls).toHaveProperty(
			"1.arguments.0",
			makeConsultationChatNamespace(model.id)
		)
		expect(previousCalls).toHaveProperty("1.arguments.1.create")
		expect(previousCalls).toHaveProperty("1.arguments.1.update")

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ firstRequest ], [ secondRequest ], [ thirdRequest ] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "GET")
		expect(firstRequest).toHaveProperty("url", `/api/consultation?${
			stringifyQuery({
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
		}`)
		expect(firstRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(firstRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(secondRequest).toHaveProperty("method", "GET")
		expect(secondRequest).toHaveProperty("url", `/api/chat_message?${
			stringifyQuery({
				"filter": {
					"chatMessageKinds": [ "text", "status" ],
					"consultationIDs": [ resource.data.id ],
					"existence": "exists"
				},
				"page": {
					"limit": 10,
					"offset": INITIAL_MESSAGE_COUNT
				},
				"sort": [ "-createdAt" ]
			} as ChatMessageQueryParameters)
		}`)
		expect(secondRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(secondRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(thirdRequest).toHaveProperty("method", "PATCH")
		expect(thirdRequest).toHaveProperty("url", `/api/consultation/${model.id}`)
		expect(thirdRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(thirdRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		const thirdRequestBody = await thirdRequest.json()
		expect(thirdRequestBody).not.toHaveProperty("data.attributes.startedAt", null)
	}, convertTimeToMilliseconds("00:00:06"))

	it("can insert messages to server", async() => {
		jest.useRealTimers()
		const OTHER_CONSULTATION_COUNT = 2
		const ALL_CONSULTATION_COUNT = OTHER_CONSULTATION_COUNT + 1
		const INITIAL_MESSAGE_COUNT = 2

		const userFactory = new UserFactory()
		const userModel = await userFactory.insertOne()
		const factory = new Factory()
		const models = await factory.insertMany(OTHER_CONSULTATION_COUNT)
		const model = await factory
		.startedAt(() => new Date())
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
		const sampleChatTextMessageModel = await chatMessageFactory
		.chatMessageActivity(() => Promise.resolve(activityOfModel))
		.kind(() => "text")
		.insertOne()

		const userResource = userFactory.deserialize(
			userModel,
			{} as unknown as void,
			new UserProfileTransformer()
		)
		const resource = factory.deserialize(model) as DeserializedConsultationDocument
		const resources = factory.deserialize([ model, ...models ])
		const chatMessageActivityResources = chatMessageActivityFactory
		.deserialize(chatMessageActivityModels)
		const previewMessageResources = chatMessageFactory.deserialize(
			previewMessageModels,
			{} as unknown as void,
			new ChatMessageTransformer({ "included": [ "user", "consultation" ] })
		)
		const chatMessageResources = chatMessageFactory
		.deserialize(chatTextMessageModels) as DeserializedChatMessageListDocument
		const sampleChatTextMessageResource = chatMessageFactory
		.deserialize(sampleChatTextMessageModel) as DeserializedChatMessageDocument

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
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })

		const wrapper = mount(Page, {
			"global": {
				"provide": {
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
		const messageInputBox = wrapper.find(".message-box input")

		await flushPromises()
		await messageInputBox.setValue(sampleChatTextMessageResource.data.data.value)
		await messageInputBox.trigger("keyup.enter")
		await flushPromises()

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "initialize")
		expect(previousCalls).toHaveProperty("0.arguments", [])
		expect(previousCalls).toHaveProperty("1.functionName", "addEventListeners")
		expect(previousCalls).toHaveProperty(
			"1.arguments.0",
			makeConsultationChatNamespace(model.id)
		)
		expect(previousCalls).toHaveProperty("1.arguments.1.create")
		expect(previousCalls).toHaveProperty("1.arguments.1.update")

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ firstRequest ], [ secondRequest ], [ thirdRequest ] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "GET")
		expect(firstRequest).toHaveProperty("url", `/api/consultation?${
			stringifyQuery({
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
		}`)
		expect(firstRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(firstRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(secondRequest).toHaveProperty("method", "GET")
		expect(secondRequest).toHaveProperty("url", `/api/chat_message?${
			stringifyQuery({
				"filter": {
					"chatMessageKinds": [ "text", "status" ],
					"consultationIDs": [ resource.data.id ],
					"existence": "exists"
				},
				"page": {
					"limit": 10,
					"offset": INITIAL_MESSAGE_COUNT
				},
				"sort": [ "-createdAt" ]
			} as ChatMessageQueryParameters)
		}`)
		expect(secondRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(secondRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(thirdRequest).toHaveProperty("method", "POST")
		expect(thirdRequest).toHaveProperty("url", "/api/chat_message")
		const thirdRequestBody = await thirdRequest.json()
		expect(thirdRequestBody).toHaveProperty("data.type", "chat_message")
		expect(thirdRequestBody).toHaveProperty(
			"data.relationships.chatMessageActivity.data.id",
			String(activityOfModel.id)
		)
	})

	it("can terminate consultation automatically", async() => {
		const OTHER_CONSULTATION_COUNT = 3
		const ALL_CONSULTATION_COUNT = OTHER_CONSULTATION_COUNT + 1
		const INITIAL_MESSAGE_COUNT = 5

		const userFactory = new UserFactory()
		const userModel = await userFactory.insertOne()
		const factory = new Factory()
		const models = await factory.insertMany(OTHER_CONSULTATION_COUNT)
		const model = await factory.startedAt(() => null).finishedAt(() => null).insertOne()
		const allModels = [ model, ...models ]
		const allModelIterator = allModels.values()
		const chatMessageActivityFactory = new ChatMessageActivityFactory()
		const chatMessageActivityModels = await chatMessageActivityFactory
		.consultation(() => Promise.resolve(allModelIterator.next().value))
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
		.insertMany(INITIAL_MESSAGE_COUNT)
		const chatStatusMessageModel = await chatMessageFactory
		.chatMessageActivity(() => Promise.resolve(activityOfModel))
		.kind(() => "status")
		.insertOne()

		const userResource = userFactory.deserialize(
			userModel,
			{} as unknown as void,
			new UserProfileTransformer()
		)
		const resource = factory.deserialize(model) as DeserializedConsultationDocument
		const resources = factory.deserialize([ model, ...models ])
		const chatMessageActivityResources = chatMessageActivityFactory
		.deserialize(chatMessageActivityModels)
		const previewMessageResources = chatMessageFactory.deserialize(
			previewMessageModels,
			{} as unknown as void,
			new ChatMessageTransformer({ "included": [ "user", "consultation" ] })
		)
		const chatTextMessageResources = chatMessageFactory.deserialize(chatTextMessageModels)
		const chatStatusMessageResource = chatMessageFactory.deserialize(chatStatusMessageModel)
		const consultationChatNamespace = makeConsultationChatNamespace(model.id)

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

		fetchMock.mockResponseOnce("{}", { "status": RequestEnvironment.status.NO_CONTENT })
		fetchMock.mockResponseOnce("{}", { "status": RequestEnvironment.status.NO_CONTENT })

		jest.useRealTimers()
		const wrapper = mount(Page, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"chatMessageActivities": chatMessageActivityResources,
							"chatMessages": chatTextMessageResources,
							"consultation": resource,
							"consultations": resources,
							"previewMessages": previewMessageResources,
							"userProfile": userResource
						}
					}
				}
			}
		})
		const startButton = wrapper.find(".user-controls .start")

		await flushPromises()
		await startButton.trigger("click")
		jest.useFakeTimers()
		await flushPromises()
		Socket.emitMockEvent(consultationChatNamespace, "create", chatStatusMessageResource)
		jest.advanceTimersByTime(convertTimeToMilliseconds("00:05"))

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "initialize")
		expect(previousCalls).toHaveProperty("0.arguments", [])
		expect(previousCalls).toHaveProperty("1.functionName", "addEventListeners")
		expect(previousCalls).toHaveProperty(
			"1.arguments.0",
			consultationChatNamespace
		)
		expect(previousCalls).toHaveProperty("1.arguments.1.create")
		expect(previousCalls).toHaveProperty("1.arguments.1.update")

		const castFetch = fetch as jest.Mock<any, any>
		const [
			[ firstRequest ],
			[ secondRequest ],
			[ thirdRequest ],
			[ fourthRequest ]
		] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "GET")
		expect(firstRequest).toHaveProperty("url", `/api/consultation?${
			stringifyQuery({
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
		}`)
		expect(firstRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(firstRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(secondRequest).toHaveProperty("method", "GET")
		expect(secondRequest).toHaveProperty("url", `/api/chat_message?${
			stringifyQuery({
				"filter": {
					"chatMessageKinds": [ "text", "status" ],
					"consultationIDs": [ resource.data.id ],
					"existence": "exists"
				},
				"page": {
					"limit": 10,
					"offset": INITIAL_MESSAGE_COUNT
				},
				"sort": [ "-createdAt" ]
			} as ChatMessageQueryParameters)
		}`)
		expect(secondRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(secondRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(thirdRequest).toHaveProperty("method", "PATCH")
		expect(thirdRequest).toHaveProperty("url", `/api/consultation/${model.id}`)
		expect(thirdRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(thirdRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		const thirdRequestBody = await thirdRequest.json()
		expect(thirdRequestBody).not.toHaveProperty("data.attributes.startedAt", null)
		expect(thirdRequestBody).toHaveProperty("data.attributes.finishedAt", null)
		expect(fourthRequest).toHaveProperty("method", "PATCH")
		expect(fourthRequest).toHaveProperty("url", `/api/consultation/${model.id}`)
		expect(fourthRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(fourthRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		const fourthRequestBody = await fourthRequest.json()
		expect(fourthRequestBody).not.toHaveProperty("data.attributes.startedAt", null)
		expect(fourthRequestBody).not.toHaveProperty("data.attributes.finishedAt", null)
	})
})
