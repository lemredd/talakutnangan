import { Op } from "sequelize"

export default class Condition {
	private currentCondition: { [key: string|symbol]: any } = {}

	not(column: string, value: any) {
		this.currentCondition[column] = { [Op.not]: value }
	}

	is(column: string, value: any) {
		this.currentCondition[column] = { [Op.is]: value }
	}

	or(...conditions: Condition[]) {
		this.currentCondition[Op.or] = conditions.reduce((previousConditions, raw) => {
			return {
				...previousConditions,
				...raw.build()
			}
		}, {})
	}

	build(): object { return { ...this.currentCondition } }
}
