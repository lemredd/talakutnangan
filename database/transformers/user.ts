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

export default class extends Transformer<User, void> {
	constructor() {
		super()
		this.type = "user"

		this.subtransformers = {
			department: new DepartmentTransformer(),
			role: new RoleTransformer(),
			"student_detail": new StudentDetailTransformer(),
			signature: new SignatureTransformer(),
		}

		this.relationships = {
			roles: this.roles.bind(this),
			department: this.department.bind(this),
			studentDetail: this.studentDetail.bind(this),
			signature: this.signature.bind(this)
		}
	}

	transform(model: User|User[], options: TransformerOptions): AttributesObject {
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
			this.subtransformers["department"] as DepartmentTransformer,
			options
		)
	}

	roles(model: User, options: TransformerOptions): RelationshipTransformerInfo {
		return Serializer.makeContext(
			model.roles,
			this.subtransformers["role"] as RoleTransformer,
			options
		)
	}

	studentDetail(model: User, options: TransformerOptions): RelationshipTransformerInfo {
		return Serializer.makeContext(
			model.studentDetail || null,
			this.subtransformers["student_detail"] as StudentDetailTransformer,
			options
		)
	}

	signature(model: User, options: TransformerOptions): RelationshipTransformerInfo {
		return Serializer.makeContext(
			model.signature || null,
			this.subtransformers["signature"] as SignatureTransformer,
			options
		)
	}
}
