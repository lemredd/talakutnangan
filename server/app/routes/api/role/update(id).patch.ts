import { Request, Response } from "!/types/dependent"
import { BaseManagerClass } from "!/types/independent"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import { UPDATE } from "$/permissions/role_combinations"
import NoContentResponseInfo from "!/response_infos/no_content"
import BoundJSONController from "!/common_controllers/bound_json_controller"
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

export default class extends BoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE
		])
	}

	get bodyValidationRules(): object {
		return {
			"data":						[ "required", "object" ],
			"data.type":				[ "required", "string", "equals:role" ],
			"data.id":					[ "required", "numeric" ],
			"data.attributes":		[ "required", "object" ],
			"data.attributes.name":	[
				"required",
				"string",
				"regex:^([A-Z][a-z-_]+ )*[A-Z][a-z-_]+$",
				[ "unique", RoleManager, "name", "data.id" ]
			],
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

	get manager(): BaseManagerClass { return RoleManager }

	async handle(request: Request, response: Response): Promise<NoContentResponseInfo> {
		const manager = new RoleManager()
		const { id, attributes } = request.body.data
		const {
			name,
			tag,
			user,
			post,
			comment,
			semester,
			profanity,
			auditTrail
		} = attributes

		await manager.update(id, {
			name,
			tag,
			user,
			post,
			comment,
			semester,
			profanity,
			auditTrail
		})

		return new NoContentResponseInfo()
	}
}
