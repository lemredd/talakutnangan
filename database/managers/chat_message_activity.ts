import type { Pipe } from "$/types/database"
import type { CommonQueryParameters } from "$/types/query"
import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type { ChatMessageActivityAttributes } from "$/types/documents/chat_message_activity"

import BaseManager from "%/managers/base"
import Model from "%/models/chat_message_activity"
import Transformer from "%/transformers/chat_message_activity"

import includeDefaults from "%/queries/chat_message_activity/include_defaults"

export default class extends BaseManager<
	Model,
	ChatMessageActivityAttributes<"deserialized">,
	CommonQueryParameters
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	get singleReadPipeline(): Pipe<FindAndCountOptions<Model>, CommonQueryParameters>[] {
		return [
			includeDefaults,
			...super.singleReadPipeline
		]
	}
}
