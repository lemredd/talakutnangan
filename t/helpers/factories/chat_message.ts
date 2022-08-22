
import type { ModelCtor } from "%/types/dependent"
import type { Message, TextMessage } from "$/types/message"
import type { GeneratedData } from "~/types/dependent"
import type {
	ChatMessageResourceIdentifier,
	ChatMessageAttributes,
	DeserializedChatMessageResource,
	DeserializedChatMessageDocument,
	DeserializedChatMessageListDocument,
	ChatMessageResource,
	ChatMessageDocument,
	ChatMessageListDocument
} from "$/types/documents/chat_message"

import { faker } from "@faker-js/faker"

import User from "%/models/user"
import UserFactory from "~/factories/user"
import BaseFactory from "~/factories/base"
import Consultation from "%/models/consultation"
import ConsultationFactory from "~/factories/consultation"
import ChatMessage from "%/models/chat_message"
import ChatMessageTransformer from "%/transformers/chat_message"

export default class ChatMessageFactory extends BaseFactory<
	ChatMessage,
	ChatMessageResourceIdentifier<"read">,
	ChatMessageAttributes<"serialized">,
	ChatMessageAttributes<"deserialized">,
	ChatMessageResource,
	DeserializedChatMessageResource,
	ChatMessageDocument,
	ChatMessageListDocument,
	DeserializedChatMessageDocument,
	DeserializedChatMessageListDocument
> {
	#userGenerator: () => Promise<User> = async() => await new UserFactory().insertOne()
	#consultationGenerator: () => Promise<Consultation>
		= async() => await new ConsultationFactory().insertOne()

	#messageGenerator: () => Message = () => ({
		"data": faker.lorem.sentence(),
		"type": "text"
	} as TextMessage)

	get model(): ModelCtor<ChatMessage> { return ChatMessage }

	get transformer(): ChatMessageTransformer { return new ChatMessageTransformer() }

	async generate(): GeneratedData<ChatMessage> {
		return {
			"consultationID": (await this.#consultationGenerator()).id,
			"message": this.#messageGenerator(),
			"userID": (await this.#userGenerator()).id
		}
	}

	message(generator: () => Message): ChatMessageFactory {
		this.#messageGenerator = generator
		return this
	}

	user(generator: () => Promise<User>): ChatMessageFactory {
		this.#userGenerator = generator
		return this
	}

	consultation(generator: () => Promise<Consultation>): ChatMessageFactory {
		this.#consultationGenerator = generator
		return this
	}
}
