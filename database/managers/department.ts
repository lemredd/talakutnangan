import type { ModelCtor } from "%/types/dependent"
import type { Serializable } from "$/types/general"
import type { CommonQueryParameters } from "$/types/query"
import type {
	DepartmentAttributes,
	DepartmentResourceIdentifier
} from "$/types/documents/department"

import User from "%/models/user"
import BaseManager from "%/managers/base"
import trimRight from "$/helpers/trim_right"
import Department from "%/models/department"
import Condition from "%/managers/helpers/condition"
import DepartmentTransformer from "%/transformers/department"

export default class  extends BaseManager<Department, DepartmentAttributes, CommonQueryParameters> {
	get model(): ModelCtor<Department> { return Department }

	get transformer(): DepartmentTransformer { return new DepartmentTransformer() }

	async countUsers(departmentIDs: number[]): Promise<Serializable> {
		try {
			const [ counts, metadata ] = await Department.sequelize!.query(
				// @ts-ignore
				Department.sequelize.getQueryInterface().queryGenerator.selectQuery(
					Department.tableName,
					{
						attributes: [
							"id",
							[
								Department.sequelize!.literal(`(${
									trimRight(
										// @ts-ignore
										User.sequelize.getQueryInterface().queryGenerator.selectQuery(
											User.tableName,
											{
												attributes: [ User.sequelize!.fn("count", "*") ],
											}
										),
										";"
									)
								})`),
								"count"
							]
						],
						where: new Condition().or(
							...departmentIDs.map(roleID => new Condition().equal("id", roleID))
						).build()
					}
				)
			)

			const identifierObjects: DepartmentResourceIdentifier[] = []

			{
				(counts as { id: number, count: number }[]).forEach((countInfo, i) => {
					identifierObjects.push({
						type: "department",
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
