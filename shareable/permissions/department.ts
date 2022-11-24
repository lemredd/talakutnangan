import {
	VIEW,
	CREATE,
	UPDATE,
	ARCHIVE_AND_RESTORE,

	PermissionMap,
	PermissionInfo,
	OperationPermission
} from "$/types/permission"

import PermissionGroup from "$/permissions/base"

const departmentColumnName = "departmentFlags"

type DepartmentFlags = {
	[departmentColumnName]: number }
export type Permissions =
	| OperationPermission
	| "merge"

/**
 * Permission group for department.
 *
 * This is safe to use in client-side.
 */
export default class extends PermissionGroup<DepartmentFlags, Permissions> {
	get name(): string { return departmentColumnName }

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
			} ],
			[ "merge", {
				"flag": 0x100,
				"mask": 0x100,
				"permissionDependencies": [
					"archiveAndRestore", "create"
				]
			} ]
		])
	}
}
