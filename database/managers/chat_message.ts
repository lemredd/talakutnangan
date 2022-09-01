import type { Pipe } from "$/types/database"
import type { Serializable } from "$/types/general"
import type { ChatMessageQueryParameters } from "$/types/query"
import type { ChatMessageAttributes } from "$/types/documents/chat_message"
import type {
	ModelCtor,
	FindAndCountOptions,
	Attributes,
	CreationAttributes
} from "%/types/dependent"

import User from "%/models/user"
import Log from "$!/singletons/log"
import BaseManager from "%/managers/base"
import Model from "%/models/chat_message"
import Consultation from "%/models/consultation"
import Transformer from "%/transformers/chat_message"
import ChatMessageActivity from "%/models/chat_message_activity"
import ChatMessageActivityManager from "%/managers/chat_message_activity"

import includeDefaults from "%/queries/chat_message/include_defaults"
import siftByConsultation from "%/queries/chat_message/sift_by_consultation"

type RawChatMessageAttributes = ChatMessageAttributes<"deserialized"> & Attributes<Model>

export default class extends BaseManager<
	Model,
	RawChatMessageAttributes,
	ChatMessageQueryParameters<number>
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	get listPipeline(): Pipe<
		FindAndCountOptions<Model>,
		ChatMessageQueryParameters<number>
	>[] {
		return [
			siftByConsultation,
			includeDefaults,
			...super.listPipeline
		]
	}

	get exposableColumns(): string[] {
		const excludedColumns = [ "id", "data", "chatMessageActivityID", "deletedAt" ]
		return super.exposableColumns.filter(columnName => {
			const isIncluded = !excludedColumns.includes(columnName)
			return isIncluded
		})
	}

	async create(
		details: RawChatMessageAttributes & CreationAttributes<Model>,
		transformerOptions: void = {} as unknown as void
	): Promise<Serializable> {
		try {
			const model = await this.model.create(details, this.transaction.transactionObject)

			const activityManager = new ChatMessageActivityManager(
				this.transaction,
				this.cache
			)

			await activityManager.update(details.chatMessageActivityID, {
				"receivedMessageAt": new Date()
			})

			model.chatMessageActivity = await ChatMessageActivity.findByPk(
				details.chatMessageActivityID,
				{
					"include": [
						{
							"model": User,
							"required": true
						},
						{
							"model": Consultation,
							"required": true
						}
					]
				}
			) as ChatMessageActivity

			Log.success("manager", "done creating a model")

			return this.serialize(model, transformerOptions, new Transformer({
				"included": [ "user", "consultation", "chatMessageActivity" ]
			}))
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}
}
