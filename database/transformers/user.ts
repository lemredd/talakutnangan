import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import User from "%/models/user"
import Transformer from "%/transformers/base"
import RoleTransformer from "%/transformers/role"
import Serializer from "%/transformers/serializer"
import SignatureTransformer from "%/transformers/signature"
import DepartmentTransformer from "%/transformers/department"
import StudentDetailTransformer from "%/transformers/student_detail"
import ProfilePictureTransformer from "%/transformers/profile_picture"
import EmployeeScheduleTransformer from "%/transformers/employee_schedule"

export default class extends Transformer<User, void> {
	constructor() {
		super("user", [
			{
				"attribute": "department",
				"transformer": new DepartmentTransformer()
			},
			{
				"attribute": "roles",
				"transformer": new RoleTransformer()
			},
			{
				"attribute": "studentDetail",
				"transformer": new StudentDetailTransformer()
			},
			{
				"attribute": "employeeSchedules",
				"transformer": new EmployeeScheduleTransformer()
			},
			{
				"attribute": "signature",
				"transformer": new SignatureTransformer()
			},
			{
				"attribute": "profilePicture",
				"transformer": new ProfilePictureTransformer()
			}
		])
	}

	transform(model: User|User[], unusedOptions: TransformerOptions): AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"name",
			"email",
			"emailVerifiedAt",
			"kind",
			"deletedAt"
		])

		return safeObject
	}
}
