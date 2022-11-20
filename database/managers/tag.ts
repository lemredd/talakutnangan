import type { Pipe } from "$/types/database"
import type { TagAttributes } from "$/types/documents/tag"
import type { FindAndCountOptions, ModelCtor } from "%/types/dependent"
import type {
	TagQueryParameters,
	PostRequirementFilter,
	CommonFilter
} from "$/types/query"

import Model from "%/models/tag"
import PostTag from "%/models/post_tag"
import BaseManager from "%/managers/base"
import Transformer from "%/transformers/tag"

import Condition from "%/helpers/condition"
import segragateIDs from "%/helpers/segragate_IDs"

import siftBySlug from "%/queries/tag/sift_by_slug"
import includeDefaults from "%/queries/tag/include_defaults"

export default class extends BaseManager<
	Model,
	TagAttributes<"deserialized">,
	TagQueryParameters,
	void,
	number,
	PostRequirementFilter & CommonFilter
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	get singleReadPipeline(): Pipe<FindAndCountOptions<Model>, TagQueryParameters>[] {
		return [
			includeDefaults,
			...super.singleReadPipeline
		]
	}

	get listPipeline(): Pipe<FindAndCountOptions<Model>, TagQueryParameters>[] {
		return [
			siftBySlug,
			includeDefaults,
			...super.listPipeline
		]
	}

	async reattach(postID: number, tagIDs: number[]): Promise<void> {
		try {
			const attachedTags = await PostTag.findAll({
				"where": new Condition().equal("postID", postID).build(),
				...this.transaction.transactionObject
			})

			const currentAttachedTagIDs = attachedTags.map(attachedTag => attachedTag.tagID)
			const { newIDs, deletedIDs } = segragateIDs(currentAttachedTagIDs, tagIDs)

			if (newIDs.length > 0) {
				await PostTag.bulkCreate(
					newIDs.map(tagID => ({
						postID,
						tagID
					})),
					{
						...this.transaction.transactionObject
					}
				)
			}

			if (deletedIDs.length > 0) {
				const deleteCondition = new Condition().and(
					new Condition().equal("postID", postID),
					new Condition().isIncludedIn("tagID", deletedIDs)
				)
				await PostTag.destroy({
					"force": true,
					"where": deleteCondition.build(),
					...this.transaction.transactionObject
				})
			}
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}
}
