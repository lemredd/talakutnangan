import type { WhereOptions } from "%/types/dependent"
import { Op } from "sequelize"

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

	search(column: string, value: string): Condition {
		// `findAndCountAll` uses `findAll`. See
		// https://github.com/sequelize/sequelize/blob/0c5ca3fc398a99eddb412fe3b2aba99f157bf59d/src/model.js#L2070
		// `findAll` uses `select`. See
		// https://github.com/sequelize/sequelize/blob/0c5ca3fc398a99eddb412fe3b2aba99f157bf59d/src/model.js#L1713
		// `select` uses query generator which handles replacements. See
		// https://github.com/sequelize/sequelize/blob/0c5ca3fc398a99eddb412fe3b2aba99f157bf59d/src/dialects/abstract/query-interface.js#L1062
		// Replacements are escaped. See
		// https://sequelize.org/docs/v6/core-concepts/raw-queries/#bind-parameter
		this.currentCondition[column] = { [Op.like]: `%${value}%` }
		return this
	}

	or(...conditions: Condition[]): Condition {
		const simplifiedConditions = this.simplifyConditions(conditions)

		if (simplifiedConditions.length === 1) {
			this.currentCondition = simplifiedConditions[0]
		} else if (simplifiedConditions.length > 1) {
			this.currentCondition[Op.or] = conditions.map(condition => condition.build())
		}

		return this
	}

	and(...conditions: Condition[]): Condition {
		const simplifiedConditions = this.simplifyConditions(conditions)

		if (simplifiedConditions.length === 1) {
			this.currentCondition = simplifiedConditions[0]
		} else if (simplifiedConditions.length > 1) {
			this.currentCondition[Op.and] = conditions.map(condition => condition.build())
		}

		return this
	}

	build(): WhereOptions<T> { return { ...this.currentCondition } }

	private simplifyConditions(conditions: Condition[]): { [key: string|symbol]: any }[] {
		return conditions.map(condition => condition.build()).filter(object => {
			for (const key in object) {
				if (Object.prototype.hasOwnProperty.call(object, key)) {
					return true
				}
			}

			return false
		})
	}
}
