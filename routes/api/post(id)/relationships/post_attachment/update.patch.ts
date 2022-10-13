import type { FieldRules, Rules } from "!/types/validation"
import type { AuthenticatedRequest, Response, BaseManagerClass } from "!/types/dependent"

import { MAXIMUM_FILE_SIZE, MINIMUM_FILE_SIZE } from "!/constants/measurement"

import Log from "$!/singletons/log"
import Policy from "!/bases/policy"
import PostManager from "%/managers/post"
import Manager from "%/managers/post_attachment"
import BoundJSONController from "!/controllers/bound_json"
import NoContentResponseInfo from "!/response_infos/no_content"

import PermissionBasedPolicy from "!/policies/permission-based"
import { post as permissionGroup } from "$/permissions/permission_list"
import {
	CREATE_PERSONAL_POST_ON_OWN_DEPARTMENT,
	CREATE_SOCIAL_POST_ON_OWN_DEPARTMENT,
	CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT
} from "$/permissions/post_combinations"

import string from "!/validators/base/string"
import object from "!/validators/base/object"
import buffer from "!/validators/base/buffer"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"
import nullable from "!/validators/base/nullable"
import regex from "!/validators/comparison/regex"
import length from "!/validators/comparison/length"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"
import makeResourceIdentifierDocumentRules from "!/rule_sets/make_resource_identifier_document"

export default class extends BoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			CREATE_PERSONAL_POST_ON_OWN_DEPARTMENT,
			CREATE_SOCIAL_POST_ON_OWN_DEPARTMENT,
			CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT
		])
	}

	makeBodyRuleGenerator(unusedRequest: AuthenticatedRequest): FieldRules {
		const attributes = {
			"fileContents": {
				"constraints": {
					"buffer": {
						"allowedMimeTypes": [ "*/*" ],
						"maximumSize": MAXIMUM_FILE_SIZE,
						"minimumSize": MINIMUM_FILE_SIZE
					}
				},
				"pipes": [ required, buffer ]
			},
			"fileType": {
				"constraints": {
					"length": {
						"maximum": 255,
						"minimum": 5
					},
					"regex": {
						"match": /(\w|-)+\/(\w|-)+(\.(\w|-)+)?(\+(\w|-)+)?/u
					}
				},
				"pipes": [ required, string, length, regex ]
			}
		}

		const relationships: Rules = {
			"constraints": {
				"object": {
					"post": {
						"constraints": {
							"object": makeResourceIdentifierDocumentRules(
								"post",
								exists,
								PostManager
							)
						},
						"pipes": [ required, object ]
					}
				}
			},
			"pipes": [ nullable, object ]
		}

		return makeResourceDocumentRules("post_attachment", attributes, {
			"extraDataQueries": { relationships },
			"isNew": true
		})
	}

	get manager(): BaseManagerClass { return Manager }

	async handle(request: AuthenticatedRequest, unusedResponse: Response)
	: Promise<NoContentResponseInfo> {
		const manager = new Manager(request)
		const { id } = request.params
		const { fileContents, fileType } = request.body.data.attributes

		await manager.update(Number(id), {
			"fileContents": fileContents.buffer,
			fileType,
			"postID": request.body.data.relationships?.post?.id || null
		})

		Log.success("controller", "successfully updated the post")

		return new NoContentResponseInfo()
	}
}
