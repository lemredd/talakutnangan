import type { SemesterManagementInfo } from "$@/types/independent"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { DeserializedSemesterResource } from "$/types/documents/semester"

import { semester as permissionGroup } from "$/permissions/permission_list"
import {
	UPDATE, ARCHIVE_AND_RESTORE
} from "$/permissions/semester_combinations"

export default function(
	userProfile: DeserializedUserProfile<"roles"|"department">,
	semester: DeserializedSemesterResource
): SemesterManagementInfo {
	const isDeleted = Boolean(semester.deletedAt)
	const roles = userProfile.data.roles.data

	const mayUpdateSemester = permissionGroup.hasOneRoleAllowed(roles, [ UPDATE ])

	const mayArchiveSemester = permissionGroup.hasOneRoleAllowed(roles, [
		ARCHIVE_AND_RESTORE
	]) && !isDeleted

	const mayRestoreSemester = permissionGroup.hasOneRoleAllowed(roles, [
		ARCHIVE_AND_RESTORE
	]) && isDeleted

	return {
		isDeleted,
		mayArchiveSemester,
		mayRestoreSemester,
		mayUpdateSemester
	}
}
