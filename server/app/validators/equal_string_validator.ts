import type { RuleData } from "!/types/dependent"
import type { GeneralObject } from "!/types/independent"

import StringValidator from "!/app/validators/string_validator"

export default class EqualStringValidator extends StringValidator {
	private target: string

	constructor(target: string) {
		super()
		this.target = target
	}

	protected get dataObject(): GeneralObject {
		const data = super.dataObject as RuleData

		data.asyncValidator = async (rule, value, callback) => {
			if (value === this.target) {
				callback()
			} else {
				callback(`${rule.field} should be ${this.target}`)
			}
		}

		return data
	}
}
