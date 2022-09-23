import type { DeserializedUserProfile } from "$/types/documents/user"
import type { AuthenticatedIDRequest, Response } from "!/types/dependent"

import Log from "$!/singletons/log"
import Validation from "!/bases/validation"
import deserialize from "$/object/deserialize"
import BodyValidation from "!/validations/body"
import IDParameterValidation from "!/validations/id_parameter"
import ProfilePictureManager from "%/managers/profile_picture"
import NoContentResponseInfo from "!/response_infos/no_content"

import exists from "!/validators/manager/exists"
import CreateController from "!%/api/user(id)/relationships/profile_picture/create.post"

export default class extends CreateController {
	get filePath(): string { return __filename }

	get validations(): Validation[] {
		const targetValidations = super.validations.filter(
			validation => validation instanceof BodyValidation
		)

		return [
			new IDParameterValidation([
				[ "id", ProfilePictureManager, exists ]
			]),
			...targetValidations
		]
	}

	async handle(request: AuthenticatedIDRequest, unusedResponse: Response)
	: Promise<NoContentResponseInfo> {
		const manager = new ProfilePictureManager(request)
		const { fileContents } = request.body.data.attributes
		const userData = deserialize(request.user) as DeserializedUserProfile
		const userID = userData.data.id
		const id = Number(request.params.id)

		await manager.update(id, {
			"fileContents": fileContents.buffer,
			userID
		})

		Log.success("controller", "successfully updated the profile picture")

		return new NoContentResponseInfo()
	}
}
