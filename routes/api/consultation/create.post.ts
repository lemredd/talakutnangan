import type { Rules, FieldRules } from "!/types/validation"
import type { OptionalMiddleware } from "!/types/independent"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { AuthenticatedRequest, Response } from "!/types/dependent"
import type { ConsultationResource } from "$/types/documents/consultation"

import { consultationReason, consultationReasonDescription } from "$!/constants/regex"

import Socket from "!/ws/socket"
import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import RoleManager from "%/managers/role"
import deserialize from "$/object/deserialize"
import JSONController from "!/controllers/json"
import ValidationError from "$!/errors/validation"
import ConsultationManager from "%/managers/consultation"
import CreatedResponseInfo from "!/response_infos/created"
import TransactionCommitter from "!/middlewares/miscellaneous/transaction_committer"
import TransactionInitializer from "!/middlewares/miscellaneous/transaction_initializer"
import makeConsultationListOfUserNamespace from "$/namespace_makers/consultation_list_of_user"

import KindBasedPolicy from "!/policies/kind-based"
import requireSignature from "!/helpers/require_signature"

import date from "!/validators/base/date"
import object from "!/validators/base/object"
import string from "!/validators/base/string"
import boolean from "!/validators/base/boolean"
import same from "!/validators/comparison/same"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"
import nullable from "!/validators/base/nullable"
import regex from "!/validators/comparison/regex"
import length from "!/validators/comparison/length"
import makeRelationshipRules from "!/rule_sets/make_relationships"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"
import existWithSameAttribute from "!/validators/manager/exist_with_same_attribute"
import uniqueConsultationSchedule from "!/validators/date/unique_consultation_schedule"
import isWithinEmployeeSchedule from "!/validators/manager/is_within_employee_schedule"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new KindBasedPolicy(
			[ "student" ],
			{ "checkOthers": requireSignature }
		)
	}

	makeBodyRuleGenerator(unusedAuthenticatedRequest: AuthenticatedRequest): FieldRules {
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

		const attributes: FieldRules = {
			"actionTaken": pureNull,
			"finishedAt": pureNull,
			"reason": {
				"constraints": {
					"length": {
						"maximum": 100,
						"minimum": 10
					},
					"regex": {
						"friendlyDescription": consultationReasonDescription,
						"match": consultationReason
					}
				},
				"pipes": [ required, string, length, regex ]
			},
			"scheduledStartAt": {
				"constraints": {
					"isWithinEmployeeSchedule": {
						"userIDPointer": "data.relationships.consultant.data.id"
					},
					"uniqueConsultationSchedule": {
						"conflictConfirmationPointer": "meta.doesAllowConflicts",
						"userIDPointer": "data.relationships.consultant.data.id"
					}
				},
				"pipes": [
					required,
					string,
					date,
					isWithinEmployeeSchedule,
					uniqueConsultationSchedule
				]
			},
			"startedAt": pureNull
		}

		const relationships: FieldRules = makeRelationshipRules([
			{
				"ClassName": UserManager,
				"isArray": false,
				"options": {
					"postIDRules": {
						"constraints": {
							"sameAttribute": {
								"columnName": "kind",
								"value": "reachable_employee"
							}
						},
						"pipes": []
					}
				},
				"relationshipName": "consultant",
				"typeName": "user",
				"validator": existWithSameAttribute
			},
			{
				"ClassName": RoleManager,
				"isArray": false,
				"relationshipName": "consultantRole",
				"typeName": "role",
				"validator": exists
			},
			{
				"ClassName": UserManager,
				"isArray": true,
				"relationshipName": "participants",
				"typeName": "user",
				"validator": exists
			}
		])

		const meta: FieldRules = {
			"meta": {
				"constraints": {
					"object": {
						"doesAllowConflicts": {
							"constraints": {
								"boolean": {
									"loose": false
								}
							},
							"pipes": [ required, boolean ]
						}
					}
				},
				"pipes": [ required, object ]
			}
		}

		return makeResourceDocumentRules(
			"consultation",
			attributes,
			{
				"extraDataQueries": relationships,
				"extraQueries": meta,
				"isNew": true,
				"mustCastID": true
			}
		)
	}

	get postValidationMiddlewares(): OptionalMiddleware[] {
		const initializer = new TransactionInitializer()
		return [
			initializer
		]
	}

	async handle(request: AuthenticatedRequest, unusedResponse: Response)
	: Promise<CreatedResponseInfo> {
		await request.transaction.initialize()

		const resource = request.body.data as ConsultationResource<"create">
		if (resource.relationships.participants.data.findIndex(
			identifier => Number(identifier.id) === Number(resource.relationships.consultant.data.id)
		) === -1) {
			throw new ValidationError(
				{
					"pointer": "data.relationships.consultant.data.id"
				},
				"The ID of the consultant must be one of the participants."
			)
		}

		const user = deserialize(request.user) as DeserializedUserProfile
		const manager = new ConsultationManager(request)

		const consultationInfo = await manager.createUsingResource(resource, Number(user.data.id))
		const userIDs = resource.relationships.participants.data.map(data => data.id)

		for (const userID of userIDs) {
			const namespace = makeConsultationListOfUserNamespace(userID)
			Socket.emitToClients(namespace, "create", consultationInfo)
		}

		return new CreatedResponseInfo(consultationInfo)
	}

	get postJobs(): OptionalMiddleware[] {
		return [
			new TransactionCommitter()
		]
	}
}
