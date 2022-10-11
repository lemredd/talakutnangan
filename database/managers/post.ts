import type { Serializable } from "$/types/general"
import type { CommonQueryParameters } from "$/types/query"
import type { Model as BaseModel, ModelCtor } from "%/types/dependent"
import type { PostAttributes, PostResource } from "$/types/documents/post"

import User from "%/models/user"
import Model from "%/models/post"
import Log from "$!/singletons/log"
import BaseManager from "%/managers/base"
import Department from "%/models/department"
import Transformer from "%/transformers/post"
import DatabaseError from "$!/errors/database"
import AttachedRole from "%/models/attached_role"
import AttachedRoleManager from "%/managers/attached_role"

export default class extends BaseManager<
	Model,
	PostAttributes<"deserialized">,
	CommonQueryParameters
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

	get modelChainToUser(): readonly ModelCtor<BaseModel>[] {
		return [
			AttachedRole,
			User
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
				throw new DatabaseError("User has incorrect role.")
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
}
