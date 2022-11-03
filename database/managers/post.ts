import type { Pipe } from "$/types/database"
import type { Serializable } from "$/types/general"
import type { PostQueryParameters } from "$/types/query"
import type { Model as BaseModel, ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type { PostAttributes, PostResource, PostResourceIdentifier } from "$/types/documents/post"

import Model from "%/models/post"
import Log from "$!/singletons/log"
import Comment from "%/models/comment"
import Condition from "%/helpers/condition"
import BaseManager from "%/managers/base"
import trimRight from "$/string/trim_right"
import Department from "%/models/department"
import Transformer from "%/transformers/post"
import DatabaseError from "$!/errors/database"
import AttachedRole from "%/models/attached_role"
import AttachedRoleManager from "%/managers/attached_role"
import includeDefaults from "%/queries/post/include_defaults"
import siftByDepartment from "%/queries/post/sift_by_department"

export default class extends BaseManager<
	Model,
	PostAttributes<"deserialized">,
	PostQueryParameters<number>
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	get exposableColumns(): string[] {
		const excludedColumns = [ "approvedAt", "attachedRoleID", "departmentID", "deletedAt" ]
		return super.exposableColumns.filter(columnName => {
			const isIncluded = !excludedColumns.includes(columnName)
			return isIncluded
		})
	}

	get singleReadPipeline(): Pipe<
		FindAndCountOptions<Model>,
		PostQueryParameters<number>
	>[] {
		return [
			includeDefaults,
			...super.singleReadPipeline
		]
	}

	get listPipeline(): Pipe<
		FindAndCountOptions<Model>,
		PostQueryParameters<number>
	>[] {
		return [
			siftByDepartment,
			includeDefaults,
			...super.listPipeline
		]
	}

	get modelChainToUser(): readonly ModelCtor<BaseModel>[] {
		return [
			AttachedRole,
			Comment
		]
	}

	async createUsingResource(
		details: PostResource<"create">,
		requesterID: number,
		transformerOptions: void = {} as unknown as void
	): Promise<Serializable> {
		try {
			const { attributes, relationships } = details

			const {
				"poster": {
					"data": {
						"id": userID
					}
				},
				"posterRole": {
					"data": {
						"id": roleID
					}
				},
				"department": {
					"data": {
						"id": departmentID
					}
				}
			} = relationships

			const attachedRoleManager = new AttachedRoleManager({
				"cache": this.cache,
				"transaction": this.transaction
			})
			const attachedRole = await attachedRoleManager.findAttachedRole(
				Number(userID),
				Number(roleID)
			)

			if (attachedRole === null) {
				throw new DatabaseError("Comment has incorrect role.")
			}

			const model = await this.model.create(
				{
					...attributes,
					"attachedRoleID": attachedRole.id,
					departmentID
				},
				this.transaction.transactionObject
			)

			model.posterInfo = attachedRole
			model.department = await Department.findByPk(Number(departmentID)) as Department

			Log.success("manager", "done creating a model")

			return await this.serialize(model, transformerOptions, this.transformer)
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	async countComments(postIDs: number[]): Promise<Serializable> {
		try {
			if (!Model.sequelize || !Comment.sequelize) {
				throw new DatabaseError("Developer may have forgot to register the models.")
			}

			const subselectQuery = Model.sequelize.literal(`(${
				trimRight(
					// @ts-ignore
					Comment.sequelize.getQueryInterface().queryGenerator.selectQuery(
						Comment.tableName, {
							"attributes": [ Comment.sequelize.fn("count", "*") ],
							"where": new Condition().equal(
								"postID",
								Comment.sequelize.col(`${Model.tableName}.id`)
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
						"attributes": [ "id", [ subselectQuery, "count" ] ],
						"where": new Condition().or(
							...postIDs.map(postID => new Condition().equal("id", postID))
						)
						.build()
					}
				)
			) as unknown as [ { id: number, count: string }[] ]

			const identifierObjects: PostResourceIdentifier[] = []
			counts.forEach(countInfo => {
				identifierObjects.push({
					"id": String(countInfo.id),
					"meta": {
						"commentCount": Number(countInfo.count)
					},
					"type": "post"
				})
			})

			return { "data": identifierObjects }
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}
}
