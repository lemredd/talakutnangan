/* eslint-disable max-len */
import { Sequelize, Op } from "sequelize"
import { DayValues, Day } from "$/types/database"

import type { WhereOptions } from "%/types/dependent"

export default class Condition<T = any> {
	private currentCondition: { [key: string|symbol]: any }

	constructor(currentCondition: { [key: string|symbol]: any } = {}) {
		this.currentCondition = currentCondition
	}

	not(column: string, value: any): Condition {
		this.currentCondition[column] = { [Op.not]: value }
		return this
	}

	is(column: string, value: any): Condition {
		this.currentCondition[column] = { [Op.is]: value }
		return this
	}

	equal(column: string, value: any): Condition {
		this.currentCondition[column] = { [Op.eq]: value }
		return this
	}

	greaterThanOrEqual(column: string, value: any): Condition {
		this.currentCondition[column] = { [Op.gte]: value }
		return this
	}

	lessThanOrEqual(column: string, value: any): Condition {
		this.currentCondition[column] = { [Op.lte]: value }
		return this
	}

	search(column: string, value: string): Condition {
		/*
		 * `findAndCountAll` uses `findAll`. See
		 * https://github.com/sequelize/sequelize/blob/0c5ca3fc398a99eddb412fe3b2aba99f157bf59d/src/model.js#L2070
		 * `findAll` uses `select`. See
		 * https://github.com/sequelize/sequelize/blob/0c5ca3fc398a99eddb412fe3b2aba99f157bf59d/src/model.js#L1713
		 * `select` uses query generator which handles replacements. See
		 * https://github.com/sequelize/sequelize/blob/0c5ca3fc398a99eddb412fe3b2aba99f157bf59d/src/dialects/abstract/query-interface.js#L1062
		 * Replacements are escaped. See
		 * https://sequelize.org/docs/v6/core-concepts/raw-queries/#bind-parameter
		 */
		this.currentCondition[column] = { [Op.like]: `%${value}%` }
		return this
	}

	isIncludedIn(column: string, value: any[]): Condition {
		this.currentCondition[column] = { [Op.in]: value }
		return this
	}

	isOnDay(column: string, value: Day): Condition {
		this.currentCondition[
			Sequelize.literal(`
				extract (
					week from ${Sequelize.col(column).col}
				)
			`.replace(/(\t|\n)+/mgu, "")).val as string
		] = { [Op.eq]: DayValues.indexOf(value) }
		return this
	}

	or(...conditions: Condition[]): Condition {
		const simplifiedConditions = this.simplifyConditions(conditions)

		if (simplifiedConditions.length === 1) {
			[ this.currentCondition ] = simplifiedConditions
		} else if (simplifiedConditions.length > 1) {
			this.currentCondition[Op.or] = conditions.map(condition => condition.build())
		}

		return this
	}

	and(...conditions: Condition[]): Condition {
		const simplifiedConditions = this.simplifyConditions(conditions)

		if (simplifiedConditions.length === 1) {
			[ this.currentCondition ] = simplifiedConditions
		} else if (simplifiedConditions.length > 1) {
			this.currentCondition[Op.and] = conditions.map(condition => condition.build())
		}

		return this
	}

	build(): WhereOptions<T> { return { ...this.currentCondition } }

	private simplifyConditions(conditions: Condition[]): { [key: string|symbol]: any }[] {
		return conditions.map(condition => condition.build()).filter(object => {
			const hasProperties = Object.getOwnPropertyNames(object).length > 0
				|| Object.getOwnPropertySymbols(object).length > 0

			return hasProperties
		})
	}
}
