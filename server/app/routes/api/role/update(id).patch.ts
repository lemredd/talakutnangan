import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { BaseManagerClass } from "!/types/independent"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import NoContentResponseInfo from "!/response_infos/no_content"
import BoundJSONController from "!/common_controllers/bound_json_controller"

import { UPDATE } from "$/permissions/role_combinations"
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
import integer from "!/app/validators/base/integer"
import same from "!/app/validators/comparison/same"
import unique from "!/app/validators/manager/unique"
import range from "!/app/validators/comparison/range"
import regex from "!/app/validators/comparison/regex"
import required from "!/app/validators/base/required"

export default class extends BoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE
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
								same: "role"
							}
						},
						id: {
							pipes: [ required, integer ],
							constraints: {}
						},
						attributes: {
							pipes: [ required, object ],
							constraints: {
								object: {
									name: {
										pipes: [ required, string, regex, unique ],
										constraints: {
											regex: { match: /^([A-Z][a-z-_]+ )*[A-Z][a-z-_]+$/ },
											manager: {
												className: RoleManager,
												columnName: "name"
											},
											unique: {
												IDPath: "data.id"
											}
										}
									},
									semesterFlags: {
										pipes: [ required, integer, range ],
										constraints: {
											range: {
												minimum: 0, maximum: semester.generateSuperMask()
											}
										}
									},
									tagFlags: {
										pipes: [ required, integer, range ],
										constraints: {
											range: {
												minimum: 0, maximum: tag.generateSuperMask()
											}
										}
									},
									postFlags: {
										pipes: [ required, integer, range ],
										constraints: {
											range: {
												minimum: 0, maximum: post.generateSuperMask()
											}
										}
									},
									commentFlags: {
										pipes: [ required, integer, range ],
										constraints: {
											range: {
												minimum: 0, maximum: comment.generateSuperMask()
											}
										}
									},
									profanityFlags: {
										pipes: [ required, integer, range ],
										constraints: {
											range: {
												minimum: 0, maximum: profanity.generateSuperMask()
											}
										}
									},
									userFlags: {
										pipes: [ required, integer, range ],
										constraints: {
											range: {
												minimum: 0, maximum: user.generateSuperMask()
											}
										}
									},
									auditTrailFlags: {
										pipes: [ required, integer, range ],
										constraints: {
											range: {
												minimum: 0, maximum: auditTrail.generateSuperMask()
											}
										}
									},
								}
							}
						}
					}
				}
			}
		}
	}

	get manager(): BaseManagerClass { return RoleManager }

	async handle(request: Request, response: Response): Promise<NoContentResponseInfo> {
		const manager = new RoleManager(request.transaction, request.cache)
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
