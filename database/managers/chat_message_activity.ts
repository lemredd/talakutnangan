import type { Pipe } from "$/types/database"
import type { ChatMessageActivityQueryParameters } from "$/types/query"
import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type { ChatMessageActivityAttributes } from "$/types/documents/chat_message_activity"

import BaseManager from "%/managers/base"
import Condition from "%/helpers/condition"
import Consultation from "%/models/consultation"
import Model from "%/models/chat_message_activity"
import Transformer from "%/transformers/chat_message_activity"

import includeDefaults from "%/queries/chat_message_activity/include_defaults"
import siftByConsultation from "%/queries/chat_message_activity/sift_by_consultation"

export default class extends BaseManager<
	Model,
	ChatMessageActivityAttributes<"deserialized">,
	ChatMessageActivityQueryParameters<number>
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	get singleReadPipeline(): Pipe<
		FindAndCountOptions<Model>,
		ChatMessageActivityQueryParameters<number>
	>[] {
		return [
			includeDefaults,
			...super.singleReadPipeline
		]
	}

	get listPipeline(): Pipe<
		FindAndCountOptions<Model>,
		ChatMessageActivityQueryParameters<number>
	>[] {
		return [
			siftByConsultation,
			includeDefaults,
			...super.listPipeline
		]
	}

	get exposableColumns(): string[] {
		const excludedColumns = [ "consultationID", "userID", "deletedAt" ]
		return super.exposableColumns.filter(columnName => {
			const isIncluded = !excludedColumns.includes(columnName)
			return isIncluded
		})
	}

	/**
	 * Retrieves the IDs of consultation that are existing and associated with chat message
	 * activities referenced by IDs passed.
	 */
	async retrieveExistingConsultationIDs(IDs: number[]): Promise<number[]> {
		try {
			const chatMessageActivities = await Model.findAll({
				"include": [
					{
						"model": Consultation,
						"required": true
					}
				],
				"where": new Condition().isIncludedIn("id", IDs).build()
			})

			const consultationIDs = chatMessageActivities.map(
				activity => activity.consultation.id
			)

			return consultationIDs
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	async findSessionID(userID: number, consultationID: number): Promise<number> {
		try {
			const chatMessageActivity = await Model.findOne({
				"where": new Condition().and(
					new Condition().equal("userID", userID),
					new Condition().equal("consultationID", consultationID)
				).build()
			}) as Model

			return chatMessageActivity.id
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}
}
