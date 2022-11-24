import {
	PermissionMap,
	PermissionInfo,
	OperationPermission,

	VIEW,
	CREATE,
	UPDATE,
	ARCHIVE_AND_RESTORE
} from "$/types/permission"

import PermissionGroup from "$/permissions/base"

const semesterColumnName = "semesterFlags"

type SemesterFlags = { [semesterColumnName]: number }
export type Permissions = OperationPermission

/**
 * Permission group for semester.
 *
 * This is safe to use in client-side.
 */
export default class extends PermissionGroup<SemesterFlags, Permissions> {
	get name(): string { return semesterColumnName }

	get permissions(): PermissionMap<Permissions> {
		return new Map<Permissions, PermissionInfo<Permissions>>([
			[ "view", {
				"flag": VIEW,
				"mask": VIEW,
				"permissionDependencies": []
			} ],
			[ "create", {
				"flag": CREATE,
				"mask": CREATE,
				"permissionDependencies": [ "view" ]
			} ],
			[ "update", {
				"flag": UPDATE,
				"mask": UPDATE,
				"permissionDependencies": [ "view" ]
			} ],
			[ "archiveAndRestore", {
				"flag": ARCHIVE_AND_RESTORE,
				"mask": ARCHIVE_AND_RESTORE,
				"permissionDependencies": [ "view" ]
			} ]
		])
	}
}
