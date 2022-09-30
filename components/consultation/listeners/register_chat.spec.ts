import { ref, nextTick } from "vue"

import type { ChatMessageDocument } from "$/types/documents/chat_message"

import Socket from "$@/external/socket"
import makeConsultationChatNamespace from "$/namespace_makers/consultation_chat"
import ChatMessageActivityFetcher from "$@/fetchers/chat_message_activity"

import listener from "./register_chat"

describe("Listener: Chats", () => {
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
})
