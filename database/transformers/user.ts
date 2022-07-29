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

		this.relationships = {
			roles: this.roles,
			department: this.department,
			studentDetail: this.studentDetail,
			signature: this.signature
		}

		this.subtransformers = {
			department: new DepartmentTransformer(),
			role: new RoleTransformer(),
			studentDetail: new StudentDetailTransformer(),
			signature: new SignatureTransformer(),
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
			this.subtransformers.department as DepartmentTransformer,
			options
		)
	}

	roles(model: User, options: TransformerOptions): RelationshipTransformerInfo {
		return Serializer.makeContext(
			model.roles,
			this.subtransformers.role as RoleTransformer,
			options
		)
	}

	studentDetail(model: User, options: TransformerOptions): RelationshipTransformerInfo {
		return Serializer.makeContext(
			model.studentDetail || null,
			this.subtransformers.studentDetail as StudentDetailTransformer,
			options
		)
	}

	signature(model: User, options: TransformerOptions): RelationshipTransformerInfo {
		return Serializer.makeContext(
			model.signature || null,
			this.subtransformers.signature as SignatureTransformer,
			options
		)
	}
}
