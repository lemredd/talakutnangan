import { DescriptorMaker } from "!/types/hybrid"
import { Descriptor } from "!/types/independent"
import { AuthenticatedRequest, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import DepartmentManager from "%/managers/department"
import NoContentResponseInfo from "!/response_infos/no_content"
import JSONController from "!/common_controllers/json_controller"

import { ARCHIVE_AND_RESTORE } from "$/permissions/department_combinations"
import { department as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"

import Exists from "!/app/validators/manager/exists"
import ArrayValidator from "!/app/validators/base/array"
import EqualString from "!/app/validators/comparison/equal_string"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			ARCHIVE_AND_RESTORE
		])
	}

	get bodyValidationRules(): object {
		return {
			"data": [ "required", "array" ],
			"data.*": [ "required", "object" ],
			"data.*.type": [ "required", "string", "equals:department" ],
			"data.*.id": [ "required", "numeric", [ "exists", DepartmentManager, "id" ] ]
		}
	}

	makeBodyRuleGenerator(): DescriptorMaker {
		return (request: AuthenticatedRequest): Descriptor => ({
			data: new ArrayValidator({
				type: new EqualString("department"),
				exists: new Exists(DepartmentManager, "id")
			})
		})
	}

	async handle(request: AuthenticatedRequest, response: Response): Promise<NoContentResponseInfo> {
		const manager = new DepartmentManager()

		const IDs = request.body.data.map((identifier: { id: number }) => identifier.id)
		await manager.archiveBatch(IDs)

		return new NoContentResponseInfo()
	}
}
