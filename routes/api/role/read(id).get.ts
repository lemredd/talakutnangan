import type { Request, Response } from "!/types/dependent"
import type { BaseManagerClass } from "!/types/independent"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import OkResponseInfo from "!/response_infos/ok"
import BoundController from "!/controllers/bound"

import { UPDATE } from "$/permissions/role_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import { role as permissionGroup } from "$/permissions/permission_list"

export default class extends BoundController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE
		])
	}

	get manager(): BaseManagerClass { return RoleManager }

	async handle(request: Request, unusedResponse: Response): Promise<OkResponseInfo> {
		const manager = new RoleManager(request.transaction, request.cache)
		const { id } = request.params

		const document = await manager.findWithID(Number(id), {
			"filter": {
				"existence": "*"
			}
		})

		return new OkResponseInfo(document)
	}
}
