import type { RuleData } from "!/types/dependent"
import type { GeneralObject, MetaValidationConstraints } from "!/types/independent"

import Validator from "!/app/validators/base/base"
import addProperCaster from "!/app/validators/base/add_proper_caster"

export default class IntegerValidator extends Validator {
	static CASTER = (value: any) => Number(value)

	private range: [number, number]|null = null

	constructor() {
		super("integer")
	}

	inclusiveRange(minimum: number, maximum: number): IntegerValidator {
		this.range = [ minimum, maximum ]

		return this
	}

	protected get dataObject(): GeneralObject {
		const data = super.dataObject as RuleData

		if (this.range !== null) {
			data.min = this.range[0]
			data.max = this.range[1]
		}

		return data
	}

	protected get metaObject(): MetaValidationConstraints {
		return addProperCaster(super.metaObject, IntegerValidator.CASTER)
	}
}
