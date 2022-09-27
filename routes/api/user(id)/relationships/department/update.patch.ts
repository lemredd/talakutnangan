import type { FieldRules } from "!/types/validation"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { DepartmentIdentifierDocument } from "$/types/documents/department"
import type { AuthenticatedIDRequest, Response, BaseManagerClass } from "!/types/dependent"

import Policy from "!/bases/policy"
import Manager from "%/managers/user"
import deserialize from "$/object/deserialize"
import DepartmentManager from "%/managers/department"
import Merger from "!/middlewares/miscellaneous/merger"
import BoundJSONController from "!/controllers/bound_json"
import NoContentResponseInfo from "!/response_infos/no_content"

import ScopeBasedPolicy from "!/policies/scope-based"
import PermissionBasedPolicy from "!/policies/permission-based"
import { user as permissionGroup } from "$/permissions/permission_list"
import {
	UPDATE_OWN_DATA,
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

import exists from "!/validators/manager/exists"
import validateExtensivelyIf from "!/validators/logical/validate_extensively_if"
import existWithSameAttribute from "!/validators/manager/exist_with_same_attribute"
import makeResourceIdentifierDocumentRules from "!/rule_sets/make_resource_identifier_document"

export default class extends BoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new Merger([
			new PermissionBasedPolicy(permissionGroup, [
				UPDATE_ANYONE_ON_OWN_DEPARTMENT,
				UPDATE_ANYONE_ON_ALL_DEPARTMENTS
			]),
			new ScopeBasedPolicy(
				permissionGroup,
				UPDATE_OWN_DATA,
				UPDATE_ANYONE_ON_OWN_DEPARTMENT,
				UPDATE_ANYONE_ON_ALL_DEPARTMENTS,
				(request: AuthenticatedIDRequest) => Promise.resolve(
					deserialize(request.user) as DeserializedUserDocument<"roles"|"department">
				)
			)
		]) as unknown as Policy
	}

	makeBodyRuleGenerator(unusedRequest: AuthenticatedIDRequest): FieldRules {
		return makeResourceIdentifierDocumentRules("department", exists, DepartmentManager, {
			"postIDRules": {
				"constraints": {
					"validateExtensivelyIf": {
						"condition": async({ request }) => {
							const authenticatedRequest = request as AuthenticatedIDRequest
							const manager = new Manager(request)
							const id = Number(authenticatedRequest.params.id)

							const user = await manager.findWithID(id)
							const deserializedUser = deserialize(user) as DeserializedUserDocument<
								"roles"|"department"
							>

							return deserializedUser.data.kind === "student"
						},
						"rules": {
							"constraints": {
								"manager": {
									"className": DepartmentManager,
									"columnName": "id"
								},
								"sameAttribute": {
									"columnName": "mayAdmit",
									"value": "1"
								}
							},
							"pipes": [ existWithSameAttribute ]
						}
					}
				},
				"pipes": [ validateExtensivelyIf ]
			}
		})
	}

	get manager(): BaseManagerClass { return Manager }

	async handle(request: AuthenticatedIDRequest, unusedResponse: Response)
	: Promise<NoContentResponseInfo> {
		const manager = new Manager(request)
		const body = request.body as DepartmentIdentifierDocument
		const id = Number(request.params.id)

		await manager.update(id, {
			"departmentID": body.data.id
		})

		return new NoContentResponseInfo()
	}
}
