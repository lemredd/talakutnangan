import type { FieldRules } from "!/types/validation"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { AuthenticatedIDRequest, Response } from "!/types/dependent"

import Log from "$!/singletons/log"
import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import Validation from "!/bases/validation"
import deserialize from "$/helpers/deserialize"
import SignatureManager from "%/managers/signature"
import OkResponseInfo from "!/response_infos/ok"
import MultipartController from "!/controllers/multipart_controller"

import {
	UPDATE_OWN_DATA,
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"
import IDParameterValidation from "!/validations/id_parameter"
import PermissionBasedPolicy from "!/policies/permission-based"
import { user as permissionGroup } from "$/permissions/permission_list"
import BelongsToCurrentUserPolicy from "!/policies/belongs_to_current_user"

import object from "!/validators/base/object"
import string from "!/validators/base/string"
import buffer from "!/validators/base/buffer"
import same from "!/validators/comparison/same"
import required from "!/validators/base/required"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

export default class extends MultipartController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE_OWN_DATA,
			UPDATE_ANYONE_ON_OWN_DEPARTMENT,
			UPDATE_ANYONE_ON_ALL_DEPARTMENTS
		])
	}

	get validations(): Validation[] {
		return [
			new IDParameterValidation([
				[ "id", UserManager ]
			]),
			...super.validations
		]
	}

	makeBodyRuleGenerator(request: AuthenticatedIDRequest): FieldRules {
		const attributes = {
			signature: {
				pipes: [ required, buffer ],
				constraints: {
					buffer: {
						// TODO: Think of maximum size of picture
						allowedMimeTypes: [ "image/png" ],
						maxSize: 1024 * 1024 * 10 // 10 MB
					}
				}
			}
		}

		return makeResourceDocumentRules("signature", attributes, true)
	}

	get postParseMiddlewares(): Policy[] {
		return [
			new BelongsToCurrentUserPolicy()
		]
	}

	async handle(request: AuthenticatedIDRequest, response: Response)
	: Promise<OkResponseInfo> {
		const manager = new SignatureManager(request.transaction, request.cache)
		const { signature } = request.body.data.attributes
		const userData = deserialize(request.user) as DeserializedUserProfile
		const userID = userData.data.id

		const newSignature = await manager.attach(Number(userID), signature)
		Log.success("controller", "successfully uploaded the signature")

		return new OkResponseInfo(newSignature)
	}
}
