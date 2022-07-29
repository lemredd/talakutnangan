import type { UserProfile } from "$/types/common_front-end"
import type { Serializable } from "$/types/database"
import type {
	AttributesObject,
	TransformerOptions,
	RelationshipTransformerInfo
} from "%/types/dependent"

import cloneDeep from "lodash.clonedeep"

import User from "%/models/user"
import Transformer from "%/transformers/base"
import DatabaseError from "$!/errors/database"
import deserialize from "$/helpers/deserialize"
import RoleTransformer from "%/transformers/role"
import Serializer from "%/transformers/serializer"
import SignatureTransformer from "%/transformers/signature"
import DepartmentTransformer from "%/transformers/department"
import RequestEnvironment from "$/helpers/request_environment"
import makeDefaultPassword from "$!/helpers/make_default_password"
import StudentDetailTransformer from "%/transformers/student_detail"

export default class extends Transformer<User, void> {
	constructor() {
		super()
		this.type = "user"

		this.subtransformers = {
			department: {
				attribute: "department",
				transformer: new DepartmentTransformer()
			},
			role: {
				attribute: "role",
				transformer: new RoleTransformer()
			},
			"student_detail": {
				attribute: "studentDetail",
				transformer: new StudentDetailTransformer()
			},
			signature: {
				attribute: "signature",
				transformer: new SignatureTransformer()
			}
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
			this.subtransformers["department"].transformer as DepartmentTransformer,
			options
		)
	}

	roles(model: User, options: TransformerOptions): RelationshipTransformerInfo {
		return Serializer.makeContext(
			model.roles,
			this.subtransformers["role"].transformer as RoleTransformer,
			options
		)
	}

	studentDetail(model: User, options: TransformerOptions): RelationshipTransformerInfo {
		return Serializer.makeContext(
			model.studentDetail || null,
			this.subtransformers["student_detail"].transformer as StudentDetailTransformer,
			options
		)
	}

	signature(model: User, options: TransformerOptions): RelationshipTransformerInfo {
		return Serializer.makeContext(
			model.signature || null,
			this.subtransformers["signature"].transformer as SignatureTransformer,
			options
		)
	}

	finalizeTransform(model: User|User[], transformedData: Serializable): Serializable {
		const postTransformedData = super.finalizeTransform(model, transformedData)
		const addPasswordStatus = (model: User, data: Serializable) => {
			const userProfile = deserialize(cloneDeep(data)) as UserProfile
			const defaultPassword = makeDefaultPassword(userProfile)
			const hasDefaultPassword = model.password === defaultPassword

			data.meta = {
				hasDefaultPassword
			}
		}

		// Only add password status for individual resource
		if (model instanceof Array) {
			transformedData.meta = {
				hasDefaultPassword: null
			}
		} else {
			if (model.kind === "student") {
				if (model.studentDetail !== null) {
					addPasswordStatus(model as User, transformedData)
				} else if(!RequestEnvironment.isOnTest && RequestEnvironment.isNotOnProduction) {
					throw new DatabaseError(`Student account (user id: ${
						model.id
					}) has no student detail to base the default password`)
				}
			} else {
				addPasswordStatus(model as User, transformedData)
			}
		}

		return postTransformedData
	}
}
