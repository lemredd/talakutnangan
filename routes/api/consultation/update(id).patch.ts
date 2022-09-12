import type { Request, Response } from "!/types/dependent"
import type { Rules, FieldRules } from "!/types/validation"
import type { BaseManagerClass } from "!/types/dependent"

import Policy from "!/bases/policy"
import Merger from "!/middlewares/miscellaneous/merger"
import ConsultationManager from "%/managers/consultation"
import NoContentResponseInfo from "!/response_infos/no_content"
import DoubleBoundJSONController from "!/controllers/double_bound_json"

import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import BelongsToCurrentUserPolicy from "!/policies/belongs_to_current_user"

import or from "!/validators/logical/or"
import date from "!/validators/base/date"
import string from "!/validators/base/string"
import same from "!/validators/comparison/same"
import required from "!/validators/base/required"
import nullable from "!/validators/base/nullable"
import regex from "!/validators/comparison/regex"
import length from "!/validators/comparison/length"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"
import uniqueConsultationSchedule from "!/validators/date/unique_consultation_schedule"

export default class extends DoubleBoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new Merger([
			CommonMiddlewareList.consultationParticipantsOnlyPolicy,
			new BelongsToCurrentUserPolicy(this.manager)
		]) as unknown as Policy
	}

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		const pureNull: Rules = {
			"constraints": {
				"nullable": {
					"defaultValue": null
				},
				"same": {
					"value": null
				}
			},
			"pipes": [ nullable, same ]
		}

		const pureDate: Rules = {
			"pipes": [ required, string, date ]
		}

		const attributes: FieldRules = {
			"actionTaken": {
				"constraints": {
					"or": {
						"rules": [
							{
								"constraints": {
									"length": {
										"maximum": 255,
										"minimum": 10
									}
								},
								"pipes": [ required, string, length ]
							},
							pureNull
						]
					}
				},
				"pipes": [ or ]
			},
			"finishedAt": {
				"constraints": {
					"or": {
						"rules": [ pureDate, pureNull ]
					}
				},
				"pipes": [ or ]
			},
			"reason": {
				"constraints": {
					"length": {
						"maximum": 100,
						"minimum": 10
					},
					"regex": {
						"match": /[a-zA-Z0-9!?. -]/u
					}
				},
				"pipes": [ required, string, length, regex ]
			},
			"scheduledStartAt": {
				"constraints": {
					// TODO: Check if the schedule fits within the schedule of employee
					"uniqueConsultationSchedule": {
						"conflictConfirmationPointer": "meta.doesAllowConflicts",
						"userIDPointer": "meta.reachableEmployeeID"
					}
				},
				"pipes": [ required, string, date, uniqueConsultationSchedule ]
			},
			"startedAt": {
				"constraints": {
					"or": {
						"rules": [ pureDate, pureNull ]
					}
				},
				"pipes": [ or ]
			}
		}

		return makeResourceDocumentRules("consultation", attributes)
	}

	get manager(): BaseManagerClass { return ConsultationManager }

	async handle(request: Request, unusedResponse: Response): Promise<NoContentResponseInfo> {
		const manager = new ConsultationManager(request)
		const { id } = request.params
		await manager.update(Number(id), request.body.data.attributes)

		return new NoContentResponseInfo()
	}
}
