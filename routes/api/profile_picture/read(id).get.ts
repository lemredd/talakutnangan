import type { ProfilePictureDocument } from "$/types/documents/profile_picture"
import type { AuthenticatedIDRequest, Response } from "!/types/dependent"

import Log from "$!/singletons/log"
import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import Validation from "!/bases/validation"
import OkResponseInfo from "!/response_infos/ok"
import sniffMediaType from "!/helpers/sniff_media_type"
import Controller from "!/bases/controller-likes/controller"
import ProfilePictureManager from "%/managers/profile_picture"

import {
	READ_OWN,
	READ_ANYONE_ON_OWN_DEPARTMENT,
	READ_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"
import IDParameterValidation from "!/validations/id_parameter"
import PermissionBasedPolicy from "!/policies/permission-based"
import { user as permissionGroup } from "$/permissions/permission_list"

export default class extends Controller {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ_OWN,
			READ_ANYONE_ON_OWN_DEPARTMENT,
			READ_ANYONE_ON_ALL_DEPARTMENTS
		])
	}

	get bodyParser(): null { return null }

	get validations(): Validation[] {
		return [
			new IDParameterValidation([
				[ "id", UserManager ]
			])
		]
	}

	async handle(request: AuthenticatedIDRequest, unusedResponse: Response)
	: Promise<OkResponseInfo> {
		const manager = new ProfilePictureManager(request.transaction, request.cache)
		const { id } = request.params

		const profilePictureDocument = await manager.findWithID(
			Number(id),
			{
				"filter": {
					"existence": "*"
				}
			},
			{ "raw": true }
		) as ProfilePictureDocument

		const profilePicture = profilePictureDocument.data.attributes.fileContents!
		const type = await sniffMediaType(profilePicture)

		Log.success("controller", "successfully got the profile picture")

		return new OkResponseInfo(profilePicture, type)
	}
}
