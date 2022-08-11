import type { FieldRules } from "!/types/validation"
import type { AuthenticatedIDRequest, Response } from "!/types/dependent"

import Log from "$!/singletons/log"
import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import Validation from "!/bases/validation"
import CreatedResponseInfo from "!/response_infos/created"
import ProfilePictureManager from "%/managers/profile_picture"
import IDParameterValidation from "!/validations/id_parameter"
import RouteParameterValidation from "!/validations/route_parameter"
import MultipartController from "!/controllers/multipart_controller"

import {
	UPDATE_OWN_DATA,
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import { user as permissionGroup } from "$/permissions/permission_list"

import object from "!/validators/base/object"
import string from "!/validators/base/string"
import buffer from "!/validators/base/buffer"
import same from "!/validators/comparison/same"
import integer from "!/validators/base/integer"
import required from "!/validators/base/required"
import notExists from "!/validators/manager/not_exists"

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
			new RouteParameterValidation(() => ({
				id: {
					pipes: [ required, integer, notExists ],
					constraints: {
						manager: {
							className: ProfilePictureManager,
							columnName: "userID"
						}
					}
				}
			})),
			...super.validations
		]
	}

	makeBodyRuleGenerator(unusedRequest: AuthenticatedIDRequest): FieldRules {
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
									fileContents: {
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
							}
						}
					}
				}
			}
		}
	}

	async handle(request: AuthenticatedIDRequest, response: Response)
	: Promise<CreatedResponseInfo> {
		const manager = new ProfilePictureManager(request.transaction, request.cache)
		const { fileContents } = request.body.data.attributes
		const userID = +request.params.id

		const profilePictureInfo = await manager.create({ userID, fileContents })

		Log.success("controller", "successfully uploaded the profile picture")

		return new CreatedResponseInfo(profilePictureInfo)
	}
}
