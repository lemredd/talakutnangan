import type { Pipe } from "$/types/database"
import type { Serializable } from "$/types/general"
import type { RoleQueryParameters } from "$/types/query"
import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type { RoleAttributes, RoleResourceIdentifier } from "$/types/documents/role"

import Role from "%/models/role"
import BaseManager from "%/managers/base"
import trimRight from "$/helpers/trim_right"
import DatabaseError from "$!/errors/database"
import AttachedRole from "%/models/attached_role"
import RoleTransformer from "%/transformers/role"
import Condition from "%/managers/helpers/condition"
import siftByDepartment from "%/queries/role/sift_by_department"

export default class extends BaseManager<Role, RoleAttributes, RoleQueryParameters> {
	get model(): ModelCtor<Role> { return Role }

	get transformer(): RoleTransformer { return new RoleTransformer() }

	get listPipeline(): Pipe<FindAndCountOptions<Role>, RoleQueryParameters>[] {
		return [
			siftByDepartment,
			...super.listPipeline
		]
	}

	async countUsers(roleIDs: number[]): Promise<Serializable> {
		try {
			if (!Role.sequelize || !AttachedRole.sequelize) {
				throw new DatabaseError("Developer may have forgot to register the models.")
			}

			const subselectQuery = Role.sequelize.literal(`(${
				trimRight(
					// @ts-ignore
					AttachedRole.sequelize.getQueryInterface().queryGenerator.selectQuery(
						AttachedRole.tableName, {
							"attributes": [ AttachedRole.sequelize.fn("count", "*") ],
							"where": new Condition().equal(
								"roleID",
								AttachedRole.sequelize.col(`${Role.tableName}.id`)
							)
							.build()
						}
					),
					";"
				)
			})`)
			const [ counts ] = await Role.sequelize.query(
				// @ts-ignore
				Role.sequelize.getQueryInterface().queryGenerator.selectQuery(
					Role.tableName, {
						"attributes": [ "id", [ subselectQuery, "count" ] ],
						"where": new Condition().or(
							...roleIDs.map(roleID => new Condition().equal("id", roleID))
						)
						.build()
					}
				)
			) as unknown as [ { id: number, count: string }[] ]

			const identifierObjects: RoleResourceIdentifier[] = []
			counts.forEach(countInfo => {
				identifierObjects.push({
					"type": "role",
					"id": String(countInfo.id),
					"meta": {
						"userCount": Number(countInfo.count)
					}
				})
			})

			return { "data": identifierObjects }
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}
}
