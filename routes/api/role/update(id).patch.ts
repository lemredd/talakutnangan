import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { BaseManagerClass } from "!/types/independent"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import NoContentResponseInfo from "!/response_infos/no_content"
import BoundJSONController from "!/controllers/bound_json_controller"

import { UPDATE } from "$/permissions/role_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import {
	tag,
	user,
	role as permissionGroup,
	post,
	comment,
	semester,
	profanity,
	auditTrail
} from "$/permissions/permission_list"

import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import unique from "!/validators/manager/unique"
import range from "!/validators/comparison/range"
import regex from "!/validators/comparison/regex"
import required from "!/validators/base/required"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

export default class extends BoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE
		])
	}

	makeBodyRuleGenerator(request: Request): FieldRules {
		const attributes: FieldRules = {
			"name": {
				"constraints": {
					"regex": { "match": /^([A-Z][a-z-_]+ )*[A-Z][a-z-_]+$/u },
					"manager": {
						"className": RoleManager,
						"columnName": "name"
					},
					"unique": {
						"IDPath": "data.id"
					}
				},
				"pipes": [ required, string, regex, unique ]
			},
			"semesterFlags": {
				"pipes": [ required, integer, range ],
				"constraints": {
					"range": {
						"minimum": 0,
						"maximum": semester.generateSuperMask()
					}
				}
			},
			"tagFlags": {
				"pipes": [ required, integer, range ],
				"constraints": {
					"range": {
						"minimum": 0,
						"maximum": tag.generateSuperMask()
					}
				}
			},
			"postFlags": {
				"pipes": [ required, integer, range ],
				"constraints": {
					"range": {
						"minimum": 0,
						"maximum": post.generateSuperMask()
					}
				}
			},
			"commentFlags": {
				"pipes": [ required, integer, range ],
				"constraints": {
					"range": {
						"minimum": 0,
						"maximum": comment.generateSuperMask()
					}
				}
			},
			"profanityFlags": {
				"pipes": [ required, integer, range ],
				"constraints": {
					"range": {
						"minimum": 0,
						"maximum": profanity.generateSuperMask()
					}
				}
			},
			"userFlags": {
				"pipes": [ required, integer, range ],
				"constraints": {
					"range": {
						"minimum": 0,
						"maximum": user.generateSuperMask()
					}
				}
			},
			"auditTrailFlags": {
				"pipes": [ required, integer, range ],
				"constraints": {
					"range": {
						"minimum": 0,
						"maximum": auditTrail.generateSuperMask()
					}
				}
			}
		}

		return makeResourceDocumentRules("role", attributes)
	}

	get manager(): BaseManagerClass { return RoleManager }

	async handle(request: Request, response: Response): Promise<NoContentResponseInfo> {
		const manager = new RoleManager(request.transaction, request.cache)
		const { id, attributes } = request.body.data

		await manager.update(id, attributes)

		return new NoContentResponseInfo()
	}
}
