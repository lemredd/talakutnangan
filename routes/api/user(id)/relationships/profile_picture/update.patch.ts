import type { FieldRules } from "!/types/validation"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { AuthenticatedIDRequest, Response } from "!/types/dependent"

import Log from "$!/singletons/log"
import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import Validation from "!/bases/validation"
import deserialize from "$/helpers/deserialize"
import ProfilePictureManager from "%/managers/profile_picture"
import NoContentResponseInfo from "!/response_infos/no_content"
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
import nullable from "!/validators/base/nullable"

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
		return {
			data: {
				pipes: [ required, object ],
				constraints: {
					object: {
						type: {
							pipes: [ required, string, same ],
							constraints: {
								same: {
									value: "profile_picture"
								}
							}
						},
						attributes: {
							pipes: [ required, object ],
							constraints: {
								object: {
									profilePicture: {
										pipes: [ nullable, buffer ],
										constraints: {
											buffer: {
												// TODO: Think of maximum size of picture
												allowedMimeTypes: [ "image/png" ],
												maxSize: 1024 * 1024 * 10 // 10 MB
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}

	get postParseMiddlewares(): Policy[] {
		return [
			new BelongsToCurrentUserPolicy()
		]
	}

	async handle(request: AuthenticatedIDRequest, response: Response)
	: Promise<NoContentResponseInfo> {
		const manager = new ProfilePictureManager(request.transaction, request.cache)
		const { profilePicture } = request.body.data.attributes
		const userData = deserialize(request.user) as DeserializedUserProfile
		const userID = userData.data.id

		await manager.updateContents(userID, profilePicture)

		Log.success("controller", "successfully uploaded the profile picture")

		return new NoContentResponseInfo()
	}
}
