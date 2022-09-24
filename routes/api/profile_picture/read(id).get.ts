import type { ProfilePictureDocument } from "$/types/documents/profile_picture"
import type {
	Response,
	BaseManagerClass,
	AuthenticatedIDRequest
} from "!/types/dependent"

import Log from "$!/singletons/log"
import Policy from "!/bases/policy"
import Manager from "%/managers/profile_picture"
import OkResponseInfo from "!/response_infos/ok"
import BoundController from "!/controllers/bound"
import sniffMediaType from "!/helpers/sniff_media_type"

import PermissionBasedPolicy from "!/policies/permission-based"
import { user as permissionGroup } from "$/permissions/permission_list"
import {
	READ_OWN,
	READ_ANYONE_ON_OWN_DEPARTMENT,
	READ_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

export default class extends BoundController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ_OWN,
			READ_ANYONE_ON_OWN_DEPARTMENT,
			READ_ANYONE_ON_ALL_DEPARTMENTS
		])
	}

	get manager(): BaseManagerClass { return Manager }

	async handle(request: AuthenticatedIDRequest, unusedResponse: Response)
	: Promise<OkResponseInfo> {
		const manager = new Manager(request)
		const { id } = request.params

		const profilePictureDocument = await manager.findWithID(
			Number(id),
			{
				"constraints": {
					"filter": {
						"existence": "*"
					}
				},
				"transformerOptions": {
					"raw": true
				}
			}
		) as ProfilePictureDocument<"read", "raw">

		const profilePicture = profilePictureDocument.data.attributes.fileContents
		const type = await sniffMediaType(profilePicture)

		Log.success("controller", "successfully got the profile picture")

		return new OkResponseInfo(profilePicture, type)
	}
}
