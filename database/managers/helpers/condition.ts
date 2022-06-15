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
