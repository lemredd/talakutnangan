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

export default class ExistsValidator extends Validator {
	private managerClass: BaseManagerClass
	private columnName: string
	private expectedType: "string"|"integer"

	constructor(type: "string"|"integer", managerClass: BaseManagerClass, columnName: string) {
		super(type)
		this.expectedType = type
		this.managerClass = managerClass
		this.columnName = columnName
	}

	protected get dataObject(): GeneralObject {
		const data = super.dataObject as RuleData

		data.asyncValidator = async (rule, value, callback) => {
			// TODO: Get transaction manager from cache
			const manager = new this.managerClass()
			const foundModel = await manager.findOneOnColumn(this.columnName, value, {
				filter: {
					existence: "exists"
				}
			})

			// TODO: Store found model in cache
			if (foundModel.data === null) {
				callback("The item does not exists in the database")
			} else {
				callback()
			}
		}

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
}
