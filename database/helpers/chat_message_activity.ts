import type { Pipe } from "$/types/database"
import type { ChatMessageActivityQueryParameters } from "$/types/query"
import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type { ChatMessageActivityAttributes } from "$/types/documents/chat_message_activity"

import BaseManager from "%/managers/base"
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
}
