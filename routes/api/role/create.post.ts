import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import JSONController from "!/common_controllers/json_controller"

import { CREATE } from "$/permissions/role_combinations"
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

import object from "!/app/validators/base/object"
import string from "!/app/validators/base/string"
import same from "!/app/validators/comparison/same"
import integer from "!/app/validators/base/integer"
import range from "!/app/validators/comparison/range"
import regex from "!/app/validators/comparison/regex"
import required from "!/app/validators/base/required"


export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			CREATE
		])
	}

	makeBodyRuleGenerator(request: Request): FieldRules {
		return {
			data: {
				pipes: [ required, object ],
				constraints: {
					object: {
						type: {
							pipes: [ required, string, same ],
							constraints: {
								same: {
									value: "role"
								}
							}
						},
						attributes: {
							pipes: [ required, object ],
							constraints: {
								object:{
									name: {
										pipes: [ required, string, regex ],
										constraints: {
											regex: { match: /^([A-Z][a-z-_]+ )*[A-Z][a-z-_]+$/ }
										}
									},
									semesterFlags: {
										pipes: [required, integer, range],
										constraints: {
											range: { minimum: 0, maximum: semester.generateSuperMask() }
										}
									},
									tagFlags: {
										pipes: [required, integer, range],
										constraints: {
											range: { minimum: 0, maximum: tag.generateSuperMask() }
										}
									},
									postFlags: {
										pipes: [required, integer, range],
										constraints: {
											range: { minimum: 0, maximum: post.generateSuperMask() }
										}
									},
									commentFlags: {
										pipes: [required, integer, range],
										constraints: {
											range: { minimum: 0, maximum: comment.generateSuperMask() }
										}
									},
									profanityFlags: {
										pipes: [required, integer, range],
										constraints: {
											range: { minimum: 0, maximum: profanity.generateSuperMask() }
										}
									},
									userFlags: {
										pipes: [required, integer, range],
										constraints: {
											range: { minimum: 0, maximum: user.generateSuperMask() }
										}
									},
									auditTrailFlags: {
										pipes: [required, integer, range],
										constraints: {
											range: { minimum: 0, maximum: auditTrail.generateSuperMask() }
										}
									},
								}
							}
						},
					}
				}
			}
		}
	}

	async handle(request: Request, response: Response): Promise<void> {
		const manager = new RoleManager(request.transaction, request.cache)
		request.body.data.attributes.departmentFlags = 1
		request.body.data.attributes.roleFlags = 1
		const roleInfo = await manager.create(request.body.data.attributes)

		response.status(this.status.CREATED).json(roleInfo)
	}
}
