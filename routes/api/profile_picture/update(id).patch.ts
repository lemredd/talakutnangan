import type { FieldRules } from "!/types/validation"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { AuthenticatedIDRequest, Response } from "!/types/dependent"

import Log from "$!/singletons/log"
import Validation from "!/bases/validation"
import deserialize from "$/helpers/deserialize"
import BodyValidation from "!/validations/body"
import IDParameterValidation from "!/validations/id_parameter"
import ProfilePictureManager from "%/managers/profile_picture"
import NoContentResponseInfo from "!/response_infos/no_content"

import object from "!/validators/base/object"
import string from "!/validators/base/string"
import buffer from "!/validators/base/buffer"
import same from "!/validators/comparison/same"
import required from "!/validators/base/required"
import nullable from "!/validators/base/nullable"

import CreateController from "!%/api/user(id)/relationships/profile_picture/create.post"

export default class extends CreateController {
	get filePath(): string { return __filename }

	get validations(): Validation[] {
		const targetValidations = super.validations.filter(
			validation => validation instanceof BodyValidation
		)

		return [
			new IDParameterValidation([
				[ "id", ProfilePictureManager ]
			]),
			...targetValidations
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
									fileContents: {
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

	async handle(request: AuthenticatedIDRequest, response: Response)
	: Promise<NoContentResponseInfo> {
		const manager = new ProfilePictureManager(request.transaction, request.cache)
		const { fileContents } = request.body.data.attributes
		const userData = deserialize(request.user) as DeserializedUserProfile
		const userID = userData.data.id
		const id = +request.params.id

		await manager.update(id, { userID, fileContents })

		Log.success("controller", "successfully updated the profile picture")

		return new NoContentResponseInfo()
	}
}
