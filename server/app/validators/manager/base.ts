import type { RuleData } from "!/types/dependent"
import type {
	GeneralObject,
	BaseManagerClass,
	MetaValidationConstraints
} from "!/types/independent"

import Validator from "!/app/validators/base/base"
import StringValidator from "!/app/validators/base/string"
import IntegerValidator from "!/app/validators/base/integer"
import addProperCaster from "!/app/validators/base/add_proper_caster"

export default abstract class BaseManagerBasedValidator extends Validator {
	protected managerClass: BaseManagerClass
	protected columnName: string
	private expectedType: "string"|"integer"

	constructor(type: "string"|"integer", managerClass: BaseManagerClass, columnName: string) {
		super(type)
		this.expectedType = type
		this.managerClass = managerClass
		this.columnName = columnName
	}

	protected get dataObject(): GeneralObject {
		const data = super.dataObject as RuleData

		data.asyncValidator = this.validator.bind(this)

		return data
	}

	protected get metaObject(): MetaValidationConstraints {
		return addProperCaster(
			super.metaObject,
			this.expectedType === "string"
				? StringValidator.CASTER
				: IntegerValidator.CASTER
		)
	}

	abstract validator(rule: any, value: any, callback: (errors?: string|Error) => void)
	: Promise<void>
}
