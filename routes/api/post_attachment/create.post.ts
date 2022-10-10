import type { FieldRules, Rules } from "!/types/validation"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { AuthenticatedRequest, Response } from "!/types/dependent"

import { MAXIMUM_FILE_SIZE, MINIMUM_FILE_SIZE } from "!/constants/measurement"

import Log from "$!/singletons/log"
import Policy from "!/bases/policy"
import PostManager from "%/managers/post"
import deserialize from "$/object/deserialize"
import Manager from "%/managers/post_attachment"
import MultipartController from "!/controllers/multipart"
import CreatedResponseInfo from "!/response_infos/created"

import ScopeBasedPolicy from "!/policies/scope-based"
import { role as permissionGroup } from "$/permissions/permission_list"
import {
	CREATE_PERSONAL_POST_ON_OWN_DEPARTMENT,
	CREATE_SOCIAL_POST_ON_OWN_DEPARTMENT,
	CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT
} from "$/permissions/post_combinations"

import object from "!/validators/base/object"
import buffer from "!/validators/base/buffer"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"
import nullable from "!/validators/base/nullable"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"
import makeResourceIdentifierDocumentRules from "!/rule_sets/make_resource_identifier_document"

export default class extends MultipartController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new ScopeBasedPolicy(
			permissionGroup,
			CREATE_PERSONAL_POST_ON_OWN_DEPARTMENT,
			CREATE_SOCIAL_POST_ON_OWN_DEPARTMENT,
			CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT,
			(request: AuthenticatedRequest) => Promise.resolve(
				deserialize(request.user) as DeserializedUserDocument<"roles"|"department">
			)
		)
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
			}
		}

		const relationships: Rules = {
			"constraints": {
				"nullable": {
					"defaultValue": null
				},
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

	async handle(request: AuthenticatedRequest, unusedResponse: Response)
	: Promise<CreatedResponseInfo> {
		const manager = new Manager(request)
		const { fileContents, fileType } = request.body.data.attributes

		const info = await manager.create({
			"fileContents": fileContents.buffer,
			fileType,
			"postID": request.body.data.relationships?.post?.id || null
		})

		Log.success("controller", "successfully uploaded the profile picture")

		return new CreatedResponseInfo(info)
	}
}
