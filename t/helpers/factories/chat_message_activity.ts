
import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type {
	ChatMessageActivityResourceIdentifier,
	ChatMessageActivityAttributes,
	DeserializedChatMessageActivityResource,
	DeserializedChatMessageActivityDocument,
	DeserializedChatMessageActivityListDocument,
	ChatMessageActivityResource,
	ChatMessageActivityDocument,
	ChatMessageActivityListDocument
} from "$/types/documents/chat_message_activity"

import User from "%/models/user"
import UserFactory from "~/factories/user"
import BaseFactory from "~/factories/base"
import Consultation from "%/models/consultation"
import ConsultationFactory from "~/factories/consultation"
import ChatMessageActivity from "%/models/chat_message_activity"
import ChatMessageActivityTransformer from "%/transformers/chat_message_activity"

export default class ChatMessageActivityFactory extends BaseFactory<
	ChatMessageActivity,
	ChatMessageActivityResourceIdentifier<"read">,
	ChatMessageActivityAttributes<"serialized">,
	ChatMessageActivityAttributes<"deserialized">,
	ChatMessageActivityResource,
	DeserializedChatMessageActivityResource,
	ChatMessageActivityDocument,
	ChatMessageActivityListDocument,
	DeserializedChatMessageActivityDocument,
	DeserializedChatMessageActivityListDocument
> {
	#userGenerator: () => Promise<User> = async() => await new UserFactory().insertOne()
	#consultationGenerator: () => Promise<Consultation>
		= async() => await new ConsultationFactory().insertOne()

	#receivedMessageAtGenerator: () => Date|null = () => null
	#seenMessageAtGenerator: () => Date|null = () => null

	get model(): ModelCtor<ChatMessageActivity> { return ChatMessageActivity }

	get transformer(): ChatMessageActivityTransformer { return new ChatMessageActivityTransformer() }

	async generate(): GeneratedData<ChatMessageActivity> {
		return {
			"consultationID": (await this.#consultationGenerator()).id,
			"receivedMessageAt": this.#receivedMessageAtGenerator(),
			"seenMessageAt": this.#seenMessageAtGenerator(),
			"userID": (await this.#userGenerator()).id
		}
	}

	async attachRelatedModels(model: ChatMessageActivity): Promise<ChatMessageActivity> {
		// ! Does not get the department of user

		model.consultation = await Consultation.findByPk(model.consultationID) as Consultation
		model.user = await User.findByPk(model.userID) as User

		return model
	}

	receivedMessageAt(generator: () => Date|null): ChatMessageActivityFactory {
		this.#receivedMessageAtGenerator = generator
		return this
	}

	seenMessageAt(generator: () => Date|null): ChatMessageActivityFactory {
		this.#seenMessageAtGenerator = generator
		return this
	}

	user(generator: () => Promise<User>): ChatMessageActivityFactory {
		this.#userGenerator = generator
		return this
	}

	consultation(generator: () => Promise<Consultation>): ChatMessageActivityFactory {
		this.#consultationGenerator = generator
		return this
	}
}
