import type { Pipe } from "$/types/database"
import type { Serializable } from "$/types/general"
import type { ChatMessageQueryParameters } from "$/types/query"
import type { ChatMessageAttributes } from "$/types/documents/chat_message"
import type { AttachedChatFileDocument } from "$/types/documents/attached_chat_file"
import type {
	Model as BaseModel,
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
import Condition from "%/helpers/condition"
import Transformer from "%/transformers/chat_message"
import ProfilePicture from "%/models/profile_picture"
import AttachedChatFile from "%/models/attached_chat_file"
import siftByKinds from "%/queries/chat_message/sift_by_kinds"
import ChatMessageActivity from "%/models/chat_message_activity"
import AttachedChatFileManager from "%/managers/attached_chat_file"
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
			siftByKinds,
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

	async findPreviews(consultationIDs: number[]): Promise<Serializable> {
		try {
			const condition = new Condition()
			condition.or(
				...consultationIDs.map(
					consultationID => new Condition().equal("id", consultationID)
				)
			)

			const consultations = await Consultation.findAll({
				"include": [
					{
						"include": [
							{
								"limit": 1,
								"model": Model,
								"order": [
									[ "createdAt", "DESC" ]
								],
								"required": true
							}
						],
						"model": ChatMessageActivity,
						"required": true
					}
				],
				"where": condition.build(),
				...this.transaction.transactionObject
			})

			const rawModels = consultations.reduce(
				(previousMessages, consultation) => {
					const messages = consultation.chatMessages

					if (messages) {
						const [ latestMessage ] = messages.sort((messageA, messageB) => {
							const comparison = -Math.sign(messageA.createdAt - messageB.createdAt)
							return comparison
						})

						return [
							...previousMessages,
							latestMessage
						]
					}

					return previousMessages
				},
				[] as Model[]
			)
			const models = await Model.findAll({
				"include": [
					{
						"include": [
							{
								"include": [
									{
										"model": ProfilePicture,
										"required": false
									}
								],
								"model": User,
								"required": true
							},
							{
								"model": Consultation,
								"required": true
							}
						],
						"model": ChatMessageActivity,
						"required": true
					}
				],
				"where": new Condition().or(
					...rawModels.map(rawModel => new Condition().equal("id", rawModel.id))
				).build()
			})

			Log.success("manager", "done searching preview messages")

			const serializedModels = await this.serialize(
				models,
				{} as unknown as void,
				new Transformer({
					"included": [ "user", "consultation" ]
				})
			)
			serializedModels.meta = {
				"count": models.length
			}
			return serializedModels
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	async create(
		details: RawChatMessageAttributes & CreationAttributes<Model>,
		transformerOptions: void = {} as unknown as void
	): Promise<Serializable> {
		try {
			const model = await this.insertModelWithUpdatedChatMessageActivity(details)

			return this.serialize(model, transformerOptions, new Transformer({
				"included": [ "user", "consultation", "chatMessageActivity" ]
			}))
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	async createWithFile(
		details: RawChatMessageAttributes & CreationAttributes<Model>,
		fileContents: Buffer,
		transformerOptions: void = {} as unknown as void
	): Promise<Serializable> {
		try {
			const model = await this.insertModelWithUpdatedChatMessageActivity(details)

			const attachedChatFileManager = new AttachedChatFileManager({
				"cache": this.cache,
				"transaction": this.transaction
			})

			const attachedDocument = await attachedChatFileManager.create({
				"chatMessageID": model.id,
				fileContents
			}) as AttachedChatFileDocument

			const attachedChatFileModel = AttachedChatFile.build({
				"chatMessageID": model.id,
				fileContents,
				"id": attachedDocument.data.id
			})

			model.attachedChatFile = attachedChatFileModel

			return this.serialize(model, transformerOptions, new Transformer({
				"included": [ "user", "consultation", "chatMessageActivity", "attachedChatFile" ]
			}))
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	get modelChainToUser(): readonly ModelCtor<BaseModel>[] {
		return [
			ChatMessageActivity,
			User
		]
	}

	private async insertModelWithUpdatedChatMessageActivity(
		details: RawChatMessageAttributes & CreationAttributes<Model>
	): Promise<Model> {
		const model = await this.model.create(details, this.transaction.transactionObject)

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

		return model
	}
}
