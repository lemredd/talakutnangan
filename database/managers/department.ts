import type { Serializable } from "$/types/general"
import type { DepartmentQueryParameters } from "$/types/query"
import type { Model as BaseModel, ModelCtor } from "%/types/dependent"
import type {
	DepartmentAttributes,
	DepartmentResourceIdentifier
} from "$/types/documents/department"

import User from "%/models/user"
import Model from "%/models/department"
import BaseManager from "%/managers/base"
import trimRight from "$/string/trim_right"
import Condition from "%/helpers/condition"
import DatabaseError from "$!/errors/database"
import Transformer from "%/transformers/department"

export default class extends BaseManager<
	Model,
	DepartmentAttributes<"deserialized">,
	DepartmentQueryParameters<number>
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	get modelChainToUser(): readonly ModelCtor<BaseModel>[] {
		throw new DatabaseError("Departments are not owned by any user.")
	}

	async countUsers(departmentIDs: number[]): Promise<Serializable> {
		try {
			if (!Model.sequelize || !User.sequelize) {
				throw new DatabaseError("Developer may have forgot to register the models.")
			}

			const subselectQuery = Model.sequelize.literal(`(${
				trimRight(
					// @ts-ignore
					User.sequelize.getQueryInterface().queryGenerator.selectQuery(
						User.tableName, {
							"attributes": [ User.sequelize.fn("count", "*") ],
							"where": new Condition().equal(
								"departmentID",
								User.sequelize.col(`${Model.tableName}.id`)
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
							...departmentIDs.map(departmentID => new Condition().equal("id", departmentID))
						)
						.build()
					}
				)
			) as unknown as [ { id: number, count: string }[] ]

			const identifierObjects: DepartmentResourceIdentifier[] = []
			counts.forEach(countInfo => {
				identifierObjects.push({
					"id": String(countInfo.id),
					"meta": {
						"userCount": Number(countInfo.count)
					},
					"type": "department"
				})
			})

			return { "data": identifierObjects }
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}
}
