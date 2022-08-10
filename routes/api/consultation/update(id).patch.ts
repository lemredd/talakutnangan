import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { BaseManagerClass } from "!/types/independent"

import Policy from "!/bases/policy"
import AttachedRoleManager from "%/managers/role"
import ConsultationManager from "%/managers/consultation"
import NoContentResponseInfo from "!/response_infos/no_content"
import BoundJSONController from "!/controllers/bound_json_controller"

import { UPDATE } from "$/permissions/department_combinations"
import { department as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/policies/permission-based"

import object from "!/validators/base/object"
import string from "!/validators/base/string"
import same from "!/validators/comparison/same"
import integer from "!/validators/base/integer"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"
import oneOf from "!/validators/comparison/one-of"

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
								same: {
									value: "consultation"
								}
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
									attachedRoleID: {
										pipes: [ required, exists ],
										constraints: {
											manager: {
												className: AttachedRoleManager,
												columnName: "id"
											},
										}
									},
									reason: {
										pipes: [ required, string ],
										constraints: { }
									},
									status: {
										pipes: [ required, oneOf ],
										constraints: {
											oneOf: {
												values: [ "will_start", "ongoing", "done" ]
											}
										}
									},
									actionTaken: {
										pipes: [ required, string ],
										constraints: { }
									},
									//TODO Dates
								}
							}
						}
					}
				}
			}
		}
	}

	get manager(): BaseManagerClass { return ConsultationManager }

	async handle(request: Request, response: Response): Promise<NoContentResponseInfo> {
		const manager = new ConsultationManager(request.transaction, request.cache)
		const id = +request.params.id
		const affectedCount = await manager.update(id, request.body.data.attributes)

		return new NoContentResponseInfo()
	}
}
