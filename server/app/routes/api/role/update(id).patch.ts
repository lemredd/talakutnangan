import { Request, Response } from "!/types/dependent"
import { BaseManagerClass } from "!/types/independent"
import { FieldRules } from "!/types/independent"

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
import { FieldRulesMaker } from "!/types/hybrid"

import object from "!/app/validators/base/object"
import required from "!/app/validators/base/required"
import same from "!/app/validators/comparison/same"
import string from "!/app/validators/base/string"
import range from "!/app/validators/comparison/range"
import regex from "!/app/validators/comparison/regex"
import integer from "!/app/validators/base/integer"
import unique from "!/app/validators/manager/unique"

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

	makeBodyRuleGenerator(): FieldRulesMaker {
		return (request: Request): FieldRules => ({
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
		})
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
