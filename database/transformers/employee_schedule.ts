import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import Transformer from "%/transformers/base"
import Serializer from "%/transformers/serializer"
import EmployeeSchedule from "%/models/employee_schedule"

export default class extends Transformer<EmployeeSchedule, void> {
	constructor() {
		super("employee_schedule")
	}

	transform(model: EmployeeSchedule|EmployeeSchedule[], unusedOptions: TransformerOptions)
	: AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"scheduleStart",
			"scheduleEnd",
			"dayName"
		])

		return safeObject
	}
}
