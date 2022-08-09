import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { BaseManagerClass } from "!/types/independent"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import Validation from "!/bases/validation"
import OkResponseInfo from "!/response_infos/ok"
import BoundJSONController from "!/controllers/bound_json_controller"

import { UPDATE } from "$/permissions/role_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import { role as permissionGroup } from "$/permissions/permission_list"
import {
	tag,
	user,
	post,
	comment,
	semester,
	profanity,
	auditTrail
} from "$/permissions/permission_list"

import object from "!/validators/base/object"
import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import same from "!/validators/comparison/same"
import unique from "!/validators/manager/unique"
import range from "!/validators/comparison/range"
import regex from "!/validators/comparison/regex"
import required from "!/validators/base/required"

export default class extends BoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE
		])
	}

	get validations(): Validation[] {
		const parentValidations = super.validations
		parentValidations.pop()
		return parentValidations
	}

	makeBodyRuleGenerator(request: Request): FieldRules {
		return {

		}
	}

	get manager(): BaseManagerClass { return RoleManager }

	async handle(request: Request, response: Response): Promise<OkResponseInfo> {
		const manager = new RoleManager(request.transaction, request.cache)
		const { id } = request.params

		const document = await manager.findWithID(+id, {
			filter: {
				existence: "exists",
				department: "*"
			}
		})

		return new OkResponseInfo(document)
	}
}
