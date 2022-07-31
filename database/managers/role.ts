import type { Serializable } from "$/types/general"
import type { CommonConstraints, Pipe } from "$/types/database"
import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type { RoleAttributes, RoleResourceIdentifier } from "$/types/documents/role"

import Role from "%/models/role"
import BaseManager from "%/managers/base"
import trimRight from "$/helpers/trim_right"
import AttachedRole from "%/models/attached_role"
import RoleTransformer from "%/transformers/role"
import Condition from "%/managers/helpers/condition"

export default class extends BaseManager<Role, RoleAttributes> {
	get model(): ModelCtor<Role> { return Role }

	get transformer(): RoleTransformer { return new RoleTransformer() }

	get listPipeline(): Pipe<FindAndCountOptions<Role>, CommonConstraints>[] {
		return [
			...super.listPipeline
		]
	}

	async countUsers(roleIDs: number[]): Promise<Serializable> {
		try {
			const [ counts, metadata ] = await Role.sequelize!.query(
				// @ts-ignore
				Role.sequelize.getQueryInterface().queryGenerator.selectQuery(
					Role.tableName,
					{
						attributes: [
							"id",
							[
								Role.sequelize!.literal(`(${
									trimRight(
										// @ts-ignore
										AttachedRole.sequelize.getQueryInterface().queryGenerator.selectQuery(
											AttachedRole.tableName,
											{
												attributes: [ AttachedRole.sequelize!.fn("count", "*") ],
												where: new Condition().equal(
													"roleID",
													AttachedRole.sequelize!.col(`${Role.tableName}.id`)
												).build()
											}
										),
										";"
									)
								})`),
								"count"
							]
						],
						where: new Condition().or(
							...roleIDs.map(roleID => new Condition().equal("id", roleID))
						).build()
					}
				)
			)

			const identifierObjects: RoleResourceIdentifier[] = []

			{
				(counts as { id: number, count: number }[]).forEach((countInfo, i) => {
					identifierObjects.push({
						type: "role",
						id: countInfo.id,
						meta: {
							userCount: +countInfo.count
						}
					})
				})
			}

			return { data: identifierObjects }
		} catch(error) {
			throw this.makeBaseError(error)
		}
	}
}
