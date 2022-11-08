import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserDocument } from "$/types/documents/user"

import { PROFILE_SETTINGS } from "$/constants/template_page_paths"

import deserialize from "$/object/deserialize"
import URLMaker from "$!/singletons/url_maker"
import isUndefined from "$/type_guards/is_undefined"
import AuthorizationError from "$!/errors/authorization"

export default function(request: AuthenticatedRequest): Promise<void> {
	const currentUser = deserialize(request.user) as DeserializedUserDocument

	if (isUndefined(currentUser.data.signature)) {
		const requirement = "User should have a signature"
		const result = "access consultation-related pages or routes."
		return Promise.reject(new AuthorizationError(
			`${requirement} to ${result}`,
			URLMaker.makeURLFromPath(PROFILE_SETTINGS)
		))
	}

	return Promise.resolve()
}
