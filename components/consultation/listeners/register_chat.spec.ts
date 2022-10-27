import { ref, nextTick } from "vue"
import { flushPromises } from "@vue/test-utils"

import type { ChatMessageDocument } from "$/types/documents/chat_message"

import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import Socket from "$@/external/socket"
import WindowFocus from "$@/external/window_focus"
import DocumentVisibility from "$@/external/document_visibility"
import ChatMessageActivityFetcher from "$@/fetchers/chat_message_activity"

import specializePath from "$/helpers/specialize_path"
import RequestEnvironment from "$/singletons/request_environment"
import { CHAT_MESSAGE_ACTIVITY_LINK } from "$/constants/template_links"
import makeConsultationChatNamespace from "$/namespace_makers/consultation_chat"

import listener from "./register_chat"

describe("Listener: Chats", () => {
	afterEach(() => {
		DocumentVisibility.clearAllListeners()
		WindowFocus.clearAllListeners()
	})

	it("can create message", async() => {
		const id = "1"
		const consultation = ref({ id }) as any
		const chatMessages = ref({ "data": [] }) as any
		const currentChatMessageActivityResource = ref({}) as any
		const chatMessageActivityFetcher = new ChatMessageActivityFetcher()
		const consultationChatNamespace = makeConsultationChatNamespace(id)
		const sampleUpdatedChatMessageResource = {
			"data": {
				"attributes": {
					"createdAt": new Date().toJSON()
				},
				id,
				"type": "chat_message"
			}
		}
		Socket.initialize()

		listener(
			consultation,
			chatMessages,
			currentChatMessageActivityResource,
			chatMessageActivityFetcher
		)
		Socket.emitMockEvent(
			consultationChatNamespace,
			"create",
			sampleUpdatedChatMessageResource as ChatMessageDocument
		)
		await nextTick()

		expect(chatMessages.value.data).toHaveLength(1)
	})

	it("can update message from others", async() => {
		const id = "1"
		const consultation = ref({ id }) as any
		const chatMessages = ref({ "data": [] }) as any
		const currentChatMessageActivityResource = ref({}) as any
		const chatMessageActivityFetcher = new ChatMessageActivityFetcher()
		const consultationChatNamespace = makeConsultationChatNamespace(id)
		const sampleUpdatedChatMessageResource = {
			"data": {
				"attributes": {
					"createdAt": new Date().toJSON()
				},
				id,
				"type": "chat_message"
			}
		}
		Socket.initialize()

		listener(
			consultation,
			chatMessages,
			currentChatMessageActivityResource,
			chatMessageActivityFetcher
		)
		Socket.emitMockEvent(
			consultationChatNamespace,
			"update",
			sampleUpdatedChatMessageResource as ChatMessageDocument
		)
		await nextTick()

		expect(chatMessages.value.data).toHaveLength(1)
	})

	it("can update `receivedMessageAt`", async() => {
		jest.useFakeTimers()
		fetchMock.mockResponse("", { "status": RequestEnvironment.status.NO_CONTENT })

		const id = "1"
		const consultation = ref({ id }) as any
		const chatMessages = ref({ "data": [] }) as any
		const currentChatMessageActivityResource = ref({ id }) as any
		const chatMessageActivityFetcher = new ChatMessageActivityFetcher()
		const consultationChatNamespace = makeConsultationChatNamespace(id)
		const sampleUpdatedChatMessageResource = {
			"data": {
				"attributes": {
					"createdAt": new Date().toJSON()
				},
				id,
				"type": "chat_message"
			}
		}
		Socket.initialize()

		listener(
			consultation,
			chatMessages,
			currentChatMessageActivityResource,
			chatMessageActivityFetcher
		)
		DocumentVisibility.emitMockEvent("visible")
		WindowFocus.emitMockEvent("focus")
		Socket.emitMockEvent(
			consultationChatNamespace,
			"create",
			sampleUpdatedChatMessageResource as ChatMessageDocument
		)
		jest.advanceTimersByTime(DEBOUNCED_WAIT_DURATION)
		await nextTick()
		await flushPromises()

		const castFetch = fetch as jest.Mock<any, any>
		expect(castFetch).toHaveBeenCalledTimes(3)
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty(
			"url",
			specializePath(
				CHAT_MESSAGE_ACTIVITY_LINK.bound,
				{ "id": currentChatMessageActivityResource.value.id }
			)
		)
	})
})
