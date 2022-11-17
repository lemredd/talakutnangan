import type { TagManagementInfo } from "$@/types/independent"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { DeserializedTagResource } from "$/types/documents/tag"

import { tag as permissionGroup } from "$/permissions/permission_list"
import {
	UPDATE, ARCHIVE_AND_RESTORE
} from "$/permissions/tag_combinations"

export default function(
	userProfile: DeserializedUserProfile<"roles"|"department">,
	tag: DeserializedTagResource
): TagManagementInfo {
	const isDeleted = Boolean(tag.deletedAt)
	const roles = userProfile.data.roles.data

	const mayUpdateTag = permissionGroup.hasOneRoleAllowed(roles, [ UPDATE ])

	const mayArchiveTag = permissionGroup.hasOneRoleAllowed(roles, [
		ARCHIVE_AND_RESTORE
	]) && !isDeleted

	const mayRestoreTag = permissionGroup.hasOneRoleAllowed(roles, [
		ARCHIVE_AND_RESTORE
	]) && isDeleted

	return {
		isDeleted,
		mayArchiveTag,
		mayRestoreTag,
		mayUpdateTag
	}
}
