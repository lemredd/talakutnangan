import { Op } from "sequelize"

export default class Condition {
	private currentCondition: { [key: string|symbol]: any } = {}

	not(column: string, value: any): Condition {
		this.currentCondition[column] = { [Op.not]: value }
		return this
	}

	is(column: string, value: any): Condition {
		this.currentCondition[column] = { [Op.is]: value }
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
		this.currentCondition[Op.or] = conditions.reduce((previousConditions, raw) => {
			return {
				...previousConditions,
				...raw.build()
			}
		}, {})
		return this
	}

	build(): object { return { ...this.currentCondition } }
}
