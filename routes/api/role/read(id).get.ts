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

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		return {

		}
	}

	get manager(): BaseManagerClass { return RoleManager }

	async handle(request: Request, unusedResponse: Response): Promise<OkResponseInfo> {
		const manager = new RoleManager(request.transaction, request.cache)
		const { id } = request.params

		const document = await manager.findWithID(Number(id), {
			"filter": {
				"department": "*",
				"existence": "*"
			}
		})

		return new OkResponseInfo(document)
	}
}
