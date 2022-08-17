import type {
	AttributesObject,
	TransformerOptions,
	RelationshipTransformerInfo
} from "%/types/dependent"

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
				"attribute": "role",
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

		this.relationships = {
			"roles": this.roles.bind(this),
			"department": this.department.bind(this),
			"studentDetail": this.studentDetail.bind(this),
			"employeeSchedules": this.employeeSchedules.bind(this),
			"signature": this.signature.bind(this),
			"profilePicture": this.profilePicture.bind(this)
		}
	}

	transform(model: User|User[], unusedOptions: TransformerOptions): AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"name",
			"email",
			"kind"
		])

		return safeObject
	}

	department(model: User, options: TransformerOptions): RelationshipTransformerInfo {
		return Serializer.makeContext(
			model.department,
			this.findTransformer("department") as DepartmentTransformer,
			options
		)
	}

	roles(model: User, options: TransformerOptions): RelationshipTransformerInfo {
		return Serializer.makeContext(
			model.roles,
			this.findTransformer("role") as RoleTransformer,
			options
		)
	}

	studentDetail(model: User, options: TransformerOptions): RelationshipTransformerInfo {
		return Serializer.makeContext(
			model.studentDetail || null,
			this.findTransformer("studentDetail") as StudentDetailTransformer,
			options
		)
	}

	employeeSchedules(model: User, options: TransformerOptions): RelationshipTransformerInfo {
		return Serializer.makeContext(
			model.employeeSchedules || null,
			this.findTransformer("employeeSchedule") as EmployeeScheduleTransformer,
			options
		)
	}

	signature(model: User, options: TransformerOptions): RelationshipTransformerInfo {
		return Serializer.makeContext(
			model.signature || null,
			this.findTransformer("signature") as SignatureTransformer,
			options
		)
	}

	profilePicture(model: User, options: TransformerOptions): RelationshipTransformerInfo {
		return Serializer.makeContext(
			model.profilePicture || null,
			this.findTransformer("profile_picture") as ProfilePictureTransformer,
			options
		)
	}
}
