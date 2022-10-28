import type { FieldRules } from "!/types/validation"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { AuthenticatedIDRequest, Response } from "!/types/dependent"

import { MAXIMUM_FILE_SIZE, MINIMUM_FILE_SIZE } from "$/constants/measurement"

import Log from "$!/singletons/log"
import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import Validation from "!/bases/validation"
import deserialize from "$/object/deserialize"
import OkResponseInfo from "!/response_infos/ok"
import SignatureManager from "%/managers/signature"
import Merger from "!/middlewares/miscellaneous/merger"
import MultipartController from "!/controllers/multipart"

import {
	UPDATE_OWN_DATA,
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"
import IDParameterValidation from "!/validations/id_parameter"
import PermissionBasedPolicy from "!/policies/permission-based"
import { user as permissionGroup } from "$/permissions/permission_list"
import BelongsToCurrentUserPolicy from "!/policies/belongs_to_current_user"

import buffer from "!/validators/base/buffer"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

export default class extends MultipartController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new Merger([
			new PermissionBasedPolicy(permissionGroup, [
				UPDATE_OWN_DATA,
				UPDATE_ANYONE_ON_OWN_DEPARTMENT,
				UPDATE_ANYONE_ON_ALL_DEPARTMENTS
			]),
			new BelongsToCurrentUserPolicy(UserManager)
		]) as unknown as Policy
	}

	get validations(): Validation[] {
		return [
			new IDParameterValidation([
				[ "id", UserManager, exists ]
			]),
			...super.validations
		]
	}

	makeBodyRuleGenerator(unusedRequest: AuthenticatedIDRequest): FieldRules {
		const attributes = {
			"fileContents": {
				"constraints": {
					"buffer": {
						"allowedMimeTypes": [ "image/png" ],
						"maximumSize": MAXIMUM_FILE_SIZE,
						"minimumSize": MINIMUM_FILE_SIZE
					}
				},
				"pipes": [ required, buffer ]
			}
		}

		return makeResourceDocumentRules("signature", attributes, {
			"isNew": true
		})
	}

	async handle(request: AuthenticatedIDRequest, unusedResponse: Response)
	: Promise<OkResponseInfo> {
		const manager = new SignatureManager(request)
		const { fileContents } = request.body.data.attributes
		const userData = deserialize(request.user) as DeserializedUserProfile
		const userID = userData.data.id

		const newSignature = await manager.attach(Number(userID), fileContents.buffer as Buffer)
		Log.success("controller", "successfully uploaded the signature")

		return new OkResponseInfo(newSignature)
	}
}
