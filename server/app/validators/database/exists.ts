import type { RuleData } from "!/types/dependent"
import type { GeneralObject, BaseManagerClass } from "!/types/independent"

import IntegerValidator from "!/app/validators/base/integer"

export default class ExistsValidator extends IntegerValidator {
	private managerClass: BaseManagerClass
	private columnName: string

	constructor(managerClass: BaseManagerClass, columnName: string) {
		super()
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
}
