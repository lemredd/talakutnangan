import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import ConsultationManager from "%/managers/consultation"
import AttachedRoleManager from "%/managers/role"
import CreatedResponseInfo from "!/response_infos/created"
import JSONController from "!/controllers/json_controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

import object from "!/validators/base/object"
import string from "!/validators/base/string"
import same from "!/validators/comparison/same"
import oneOf from "!/validators/comparison/one-of"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"


export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return CommonMiddlewareList.studentOnlyPolicy
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

	async handle(request: Request, response: Response): Promise<CreatedResponseInfo> {
		const manager = new ConsultationManager(request.transaction, request.cache)
		const consultationInfo = await manager.create(request.body.data.attributes)

		return new CreatedResponseInfo(consultationInfo)
	}
}
