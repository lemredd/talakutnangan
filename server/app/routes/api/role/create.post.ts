import { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import { CREATE } from "$/permissions/role_combinations"
import JSONController from "!/common_controllers/json_controller"
import { role as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"
import {
	tag,
	user,
	post,
	comment,
	semester,
	profanity,
	auditTrail
} from "$/permissions/permission_list"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			CREATE
		])
	}

	get bodyValidationRules(): object {
		return {
			"data":										[ "required", "object" ],
			"data.type":								[ "required", "string", "equals:role" ],
			"data.attributes":						[ "required", "object" ],
			"data.attributes.name":					[ "required", "string" ],
			"data.attributes.semesterFlags":	[
				"required",
				"numeric",
				[ "min", 0 ],
				[ "max", semester.generateSuperMask() ]
			],
			"data.attributes.tagFlags": [
				"required",
				"numeric",
				[ "min", 0 ],
				[ "max", tag.generateSuperMask() ]
			],
			"data.attributes.postFlags":		[
				"required",
				"numeric",
				[ "min", 0 ],
				[ "max", post.generateSuperMask() ]
			],
			"data.attributes.commentFlags":	[
				"required",
				"numeric",
				[ "min", 0 ],
				[ "max", comment.generateSuperMask() ]
			],
			"data.attributes.profanityFlags":[
				"required",
				"numeric",
				[ "min", 0 ],
				[ "max", profanity.generateSuperMask() ]
			],
			"data.attributes.userFlags":		[
				"required",
				"numeric",
				[ "min", 0 ],
				[ "max", user.generateSuperMask() ]
			],
			"data.attributes.auditTrailFlags":[
				"required",
				"numeric",
				[ "min", 0 ],
				[ "max", auditTrail.generateSuperMask() ]
			]
		}
	}

	async handle(request: Request, response: Response): Promise<void> {
		const manager = new RoleManager()
		request.body.data.attributes.departmentFlags = 1
		request.body.data.attributes.roleFlags = 1
		const roleInfo = await manager.create(request.body.data.attributes)

		response.status(this.status.CREATED).json(roleInfo)
	}
}
