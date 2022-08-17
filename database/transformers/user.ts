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
		return this.makeRelationshipTransformerInfo(model, "department", options)
	}

	roles(model: User, options: TransformerOptions): RelationshipTransformerInfo {
		return this.makeRelationshipTransformerInfo(model, "roles", options)
	}

	studentDetail(model: User, options: TransformerOptions): RelationshipTransformerInfo {
		return this.makeRelationshipTransformerInfo(model, "studentDetail", options)
	}

	employeeSchedules(model: User, options: TransformerOptions): RelationshipTransformerInfo {
		return this.makeRelationshipTransformerInfo(model, "employeeSchedules", options)
	}

	signature(model: User, options: TransformerOptions): RelationshipTransformerInfo {
		return this.makeRelationshipTransformerInfo(model, "signature", options)
	}

	profilePicture(model: User, options: TransformerOptions): RelationshipTransformerInfo {
		return this.makeRelationshipTransformerInfo(model, "profilePicture", options)
	}
}
