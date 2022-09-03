import { shallowMount } from "@vue/test-utils"

import UserFactory from "~/factories/user"
import Stub from "$/helpers/singletons/stub"
import Factory from "~/factories/consultation"
import ChatMessageFactory from "~/factories/chat_message"
import ChatMessageActivity from "%/models/chat_message_activity"
import UserProfileTransformer from "%/transformers/user_profile"
import ChatMessageActivityFactory from "~/factories/chat_message_activity"

import Page from "./read.page.vue"

describe("UI Page: Read resource by ID", () => {
	it("should load resource by ID", async() => {
		const userFactory = new UserFactory()
		const userModel = await userFactory.insertOne()
		const factory = new Factory()
		const models = await factory.insertMany(3)
		const model = await factory.insertOne()
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
			chatMessageActivityModel => chatMessageActivityModel.consultationID === model.id
		) as ChatMessageActivity
		const chatMessageModels = await chatMessageFactory
		.chatMessageActivity(() => Promise.resolve(activityOfModel))
		.insertMany(5)

		const userResource = userFactory.deserialize(
			userModel,
			{} as unknown as void,
			new UserProfileTransformer()
		)
		const resource = factory.deserialize(model)
		const resources = factory.deserialize(models)
		const chatMessageActivityResources = chatMessageActivityFactory
		.deserialize(chatMessageActivityModels)
		const previewMessageResources = chatMessageFactory.deserialize(previewMessageModels)
		const chatMessageResources = chatMessageFactory.deserialize(chatMessageModels)
		const wrapper = shallowMount(Page, {
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
				},
				"stubs": {
					"ConsultationShell": false
				}
			}
		})

		const consultationList = wrapper.findComponent({ "name": "ConsultationList" })
		const chatWindow = wrapper.findComponent({ "name": "ChatWindow" })

		expect(consultationList.exists()).toBeTruthy()
		expect(chatWindow.exists()).toBeTruthy()
	})

	it("can visit resource by ID", async() => {
		const userFactory = new UserFactory()
		const userModel = await userFactory.insertOne()
		const factory = new Factory()
		const models = await factory.insertMany(3)
		const model = await factory.insertOne()
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
			chatMessageActivityModel => chatMessageActivityModel.consultationID === model.id
		) as ChatMessageActivity
		const chatMessageModels = await chatMessageFactory
		.chatMessageActivity(() => Promise.resolve(activityOfModel))
		.insertMany(5)

		const userResource = userFactory.deserialize(
			userModel,
			{} as unknown as void,
			new UserProfileTransformer()
		)
		const resource = factory.deserialize(model)
		const resources = factory.deserialize(models)
		const chatMessageActivityResources = chatMessageActivityFactory
		.deserialize(chatMessageActivityModels)
		const previewMessageResources = chatMessageFactory.deserialize(previewMessageModels)
		const chatMessageResources = chatMessageFactory.deserialize(chatMessageModels)
		const wrapper = shallowMount(Page, {
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
				},
				"stubs": {
					"ConsultationShell": false
				}
			}
		})
		const consultationList = wrapper.findComponent({ "name": "ConsultationList" })

		await consultationList.vm.$emit("picked-consultation", "1")

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "assignPath")
		expect(previousCalls).toHaveProperty("0.arguments", [ "/consultation/1" ])
	})
})
