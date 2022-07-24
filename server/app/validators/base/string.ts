import type { RuleData } from "!/types/dependent"
import type { GeneralObject, MetaValidationConstraints } from "!/types/independent"

import Validator from "!/app/validators/base/base"
import addProperCaster from "!/app/validators/base/add_proper_caster"

export default class StringValidator extends Validator {
	static CASTER = (value: any) => String(value).trim()

	private lengthLimit: [number, number]|null = null

	constructor() {
		super("string")
	}

	inclusiveLength(minimum: number, maximum: number): StringValidator {
		this.lengthLimit = [ minimum, maximum ]

		return this
	}

	protected get dataObject(): GeneralObject {
		const data = super.dataObject as RuleData

		if (this.lengthLimit !== null) {
			data.min = this.lengthLimit[0]
			data.max = this.lengthLimit[1]
		}

		return data
	}

	protected get metaObject(): MetaValidationConstraints {
		return addProperCaster(super.metaObject, StringValidator.CASTER)
	}
}
