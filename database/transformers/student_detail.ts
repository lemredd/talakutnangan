import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import Transformer from "%/transformers/base"
import Serializer from "%/transformers/serializer"
import StudentDetail from "%/models/student_detail"

export default class extends Transformer<StudentDetail, void> {
	constructor() {
		super("student_detail")
	}

	transform(model: StudentDetail|StudentDetail[], options: TransformerOptions): AttributesObject {
		const safeObject = Serializer.whitelist(model, [ "studentNumber" ])

		return safeObject
	}
}
