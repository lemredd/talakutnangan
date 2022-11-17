import type { FieldRules } from "!/types/validation"
import type { TagQueryParameters } from "$/types/query"
import type { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import Manager from "%/managers/tag"
import ListResponse from "!/response_infos/list"
import QueryController from "!/controllers/query"

import { READ } from "$/permissions/tag_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import { tag as permissionGroup } from "$/permissions/permission_list"

import string from "!/validators/base/string"
import boolean from "!/validators/base/boolean"
import nullable from "!/validators/base/nullable"
import length from "!/validators/comparison/length"
import makeListRules from "!/rule_sets/make_list"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ
		])
	}

	makeQueryRuleGenerator(unusedRequest: Request): FieldRules {
		return makeListRules(Manager, {
			"mustHavePost": {
				"constraints": {
					"boolean": {
						"loose": true
					},
					"nullable": { "defaultValue": "false" }
				},
				"pipes": [ nullable, boolean ]
			},
			"slug": {
				"constraints": {
					"length": {
						"maximum": 255
					},
					"nullable": { "defaultValue": "" }
				},
				"pipes": [ nullable, string, length ]
			}
		})
	}

	async handle(request: Request, unusedResponse: Response): Promise<ListResponse> {
		const constraints = { ...request.query } as TagQueryParameters

		const manager = new Manager(request)
		const tags = await manager.list(constraints)

		return new ListResponse(tags)
	}
}
