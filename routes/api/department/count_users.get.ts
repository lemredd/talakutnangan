import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { DepartmentQueryParameters } from "$/types/query"
import type { DepartmentResourceIdentifier } from "$/types/documents/department"

import Policy from "!/bases/policy"
import ListResponse from "!/response_infos/list"
import DepartmentManager from "%/managers/department"
import QueryController from "!/controllers/query_controller"

import { READ } from "$/permissions/department_combinations"
import { department as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/policies/permission-based"

import object from "!/validators/base/object"
import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"
import nullable from "!/validators/base/nullable"
import oneOf from "!/validators/comparison/one-of"
import length from "!/validators/comparison/length"
import stringArray from "!/validators/hybrid/string_array"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ
		])
	}

	makeQueryRuleGenerator(request: Request): FieldRules {
		return {
			filter: {
				pipes: [ nullable, object ],
				constraints: {
					nullable: { defaultValue: {} },
					object: {
						existence: {
							pipes: [ nullable, string, oneOf ],
							constraints: {
								nullable: { defaultValue: "exists" },
								oneOf: { values: [ "*", "exists", "archived" ] }
							}
						},
						IDs: {
							pipes: [ required, stringArray, length ],
							constraints: {
								array: {
									pipes: [ integer, exists ],
									constraints: {
										manager: {
											className: DepartmentManager,
											columnName: "id"
										}
									}
								},
								length: {
									minimum: 1,
									maximum: +process.env.DATABASE_MAX_SELECT! || 10
								}
							}
						}
					}
				}
			}
		}
	}

	async handle(request: Request, response: Response): Promise<ListResponse> {
		const query = request.query as unknown as Pick<DepartmentQueryParameters, "filter">

		const manager = new DepartmentManager(request.transaction, request.cache)
		const departmentWithUserCount = await manager
			.countUsers(query.filter.IDs!) as DepartmentResourceIdentifier

		return new ListResponse(departmentWithUserCount)
	}
}
