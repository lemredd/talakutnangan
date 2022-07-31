import type { CountUser } from "$/types/database"
import type { FindOptions } from "%/types/dependent"

import Log from "$!/singletons/log"

import AttachedRole from "%/models/attached_role"

/**
 * Counts the users associated to roles.
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: Partial<CountUser>
): FindOptions<T> {
	if (constraints.meta === undefined || constraints.meta.countUser === undefined)
		return currentState

	const newState = { ...currentState }

	if(constraints.meta.countUser) {
		if (newState.group === undefined) {
			newState.group = []
		}

		(newState.group as any[]).push("id")

		if (newState.include === undefined) {
			newState.include = []
		}

		(newState.include as any[])!.push(AttachedRole)
	}

	Log.trace("pipeline", "count users")

	return newState
}

/**
 * Previous code to count which fails:
		if ((newState.attributes as any)?.includes === undefined) {
			(newState.attributes as any).includes = []
		}

		(newState.attributes as any & { includes: any[] }).includes.push([
			// See https://github.com/sequelize/sequelize/blob/16cca528022af31ec4746d23e595312c51501cba/test/unit/query-generator/select-query.test.ts#L38
			// @ts-ignore
			AttachedRole.sequelize?.getQueryInterface().queryGenerator.selectQuery(
				AttachedRole.tableName,
				{
					attributes: [ AttachedRole.sequelize.fn("count", "*") ],
					where: new Condition().equal("roleID", AttachedRole.sequelize.col("role.id")).build()
				}
			),
			"userCount"
		])
 */
