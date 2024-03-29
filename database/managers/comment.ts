import type { Pipe } from "$/types/database"
import type { Serializable } from "$/types/general"
import type { CommentQueryParameters } from "$/types/query"
import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type {
	CommentAttributes,
	CommentResourceIdentifier,
	CompleteVoteKind
} from "$/types/documents/comment"

import Model from "%/models/comment"
import BaseManager from "%/managers/base"
import Condition from "%/helpers/condition"
import trimRight from "$/string/trim_right"
import DatabaseError from "$!/errors/database"
import CommentVote from "%/models/comment_vote"
import Transformer from "%/transformers/comment"
import siftByPost from "%/queries/comment/sift_by_post"
import includeDefaults from "%/queries/comment/include_defaults"

export default class extends BaseManager<
	Model,
	CommentAttributes<"deserialized">,
	CommentQueryParameters<number>
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	get listPipeline(): Pipe<
		FindAndCountOptions<Model>,
		CommentQueryParameters<number>
	>[] {
		return [
			siftByPost,
			includeDefaults,
			...super.listPipeline
		]
	}

	get exposableColumns(): string[] {
		const excludedColumns = [
			"approvedAt",
			"userID",
			"postID",
			"commentID",
			"deletedAt"
		]
		return super.exposableColumns.filter(columnName => {
			const isIncluded = !excludedColumns.includes(columnName)
			return isIncluded
		})
	}

	async countVotes(currentUserID: number, commentIDs: number[]): Promise<Serializable> {
		try {
			if (!Model.sequelize || !CommentVote.sequelize) {
				throw new DatabaseError("Developer may have forgot to register the models.")
			}

			const upvoteSubselectQuery = Model.sequelize.literal(`(${
				trimRight(
					// @ts-ignore
					CommentVote.sequelize.getQueryInterface().queryGenerator.selectQuery(
						CommentVote.tableName, {
							"attributes": [ CommentVote.sequelize.fn("count", "*") ],
							"where": new Condition().and(
								new Condition().equal(
									"commentID",
									CommentVote.sequelize.col(`${Model.tableName}.id`)
								),
								new Condition().equal("kind", "upvote")
							)
							.build()
						}
					),
					";"
				)
			})`)
			const downvoteSubselectQuery = Model.sequelize.literal(`(${
				trimRight(
					// @ts-ignore
					CommentVote.sequelize.getQueryInterface().queryGenerator.selectQuery(
						CommentVote.tableName, {
							"attributes": [ CommentVote.sequelize.fn("count", "*") ],
							"where": new Condition().and(
								new Condition().equal(
									"commentID",
									CommentVote.sequelize.col(`${Model.tableName}.id`)
								),
								new Condition().equal("kind", "downvote")
							)
							.build()
						}
					),
					";"
				)
			})`)

			const ownUpvoteSubselectQuery = Model.sequelize.literal(`(${
				trimRight(
					// @ts-ignore
					CommentVote.sequelize.getQueryInterface().queryGenerator.selectQuery(
						CommentVote.tableName, {
							"attributes": [ "id" ],
							"where": new Condition().and(
								new Condition().equal(
									"commentID",
									CommentVote.sequelize.col(`${Model.tableName}.id`)
								),
								new Condition().equal("userID", currentUserID),
								new Condition().equal("kind", "upvote")
							)
							.build()
						}
					),
					";"
				)
			})`)
			const ownDownvoteSubselectQuery = Model.sequelize.literal(`(${
				trimRight(
					// @ts-ignore
					CommentVote.sequelize.getQueryInterface().queryGenerator.selectQuery(
						CommentVote.tableName, {
							"attributes": [ "id" ],
							"where": new Condition().and(
								new Condition().equal(
									"commentID",
									CommentVote.sequelize.col(`${Model.tableName}.id`)
								),
								new Condition().equal("userID", currentUserID),
								new Condition().equal("kind", "downvote")
							)
							.build()
						}
					),
					";"
				)
			})`)

			const [ counts ] = await Model.sequelize.query(
				// @ts-ignore
				Model.sequelize.getQueryInterface().queryGenerator.selectQuery(
					Model.tableName, {
						"attributes": [
							"id",
							[ upvoteSubselectQuery, "upvoteCount" ],
							[ downvoteSubselectQuery, "downvoteCount" ],
							[ ownUpvoteSubselectQuery, "ownUpvoteID" ],
							[ ownDownvoteSubselectQuery, "ownDownvoteID" ]
						],
						"where": new Condition().or(
							...commentIDs.map(commentID => new Condition().equal("id", commentID))
						)
						.build()
					}
				)
			) as unknown as [ {
				id: number,
				upvoteCount: string,
				downvoteCount: string,
				ownUpvoteID: string|null,
				ownDownvoteID: string|null
			}[] ]

			const identifierObjects: CommentResourceIdentifier[] = []
			counts.forEach(countInfo => {
				const { ownUpvoteID, ownDownvoteID } = countInfo

				let currentUserVoteStatus: CompleteVoteKind = "abstain"
				if (ownDownvoteID !== null) currentUserVoteStatus = "downvote"
				else if (ownUpvoteID !== null) currentUserVoteStatus = "upvote"

				const commentVoteID = ownDownvoteID || ownUpvoteID

				identifierObjects.push({
					"id": String(countInfo.id),
					"meta": {
						"commentVoteID": commentVoteID === null ? null : String(commentVoteID),
						currentUserVoteStatus,
						"downvoteCount": Number(countInfo.downvoteCount),
						"upvoteCount": Number(countInfo.upvoteCount)
					},
					"type": "comment"
				})
			})

			return { "data": identifierObjects }
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}
}
