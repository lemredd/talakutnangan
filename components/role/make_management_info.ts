import type { RoleManagementInfo } from "$@/types/independent"
import type { DeserializedRoleResource } from "$/types/documents/role"
import type { DeserializedUserProfile } from "$/types/documents/user"

import { role as permissionGroup } from "$/permissions/permission_list"
import {
	UPDATE, ARCHIVE_AND_RESTORE
} from "$/permissions/role_combinations"

export default function(
	userProfile: DeserializedUserProfile<"roles"|"department">,
	role: DeserializedRoleResource
): RoleManagementInfo {
	const isDeleted = Boolean(role.deletedAt)
	const userRoles = userProfile.data.roles.data

	const mayUpdateRole = permissionGroup.hasOneRoleAllowed(userRoles, [ UPDATE ])

	const mayArchiveRole = permissionGroup.hasOneRoleAllowed(userRoles, [
		ARCHIVE_AND_RESTORE
	])

	const mayRestoreRole = permissionGroup.hasOneRoleAllowed(userRoles, [
		ARCHIVE_AND_RESTORE
	])

	return {
		isDeleted,
		mayArchiveRole,
		mayRestoreRole,
		mayUpdateRole
	}
}
