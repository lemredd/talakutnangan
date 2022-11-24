import {
	PermissionMap,
	PermissionInfo,
	LevelPermission,
	OperationPermission,

	VIEW,
	CREATE,
	UPDATE,
	ARCHIVE_AND_RESTORE,

	WRITE_OWN_SCOPE,
	WRITE_OVERALL_SCOPE,
	READ_OVERALL_SCOPE,
	READ_DEPARTMENT_SCOPE,
	WRITE_DEPARTMENT_SCOPE,

	READ_SCOPE_MASK,
	WRITE_SCOPE_MASK
} from "$/types/permission"

import PermissionGroup from "$/permissions/base"

const postColumnName = "postFlags"

type PostFlags = { [postColumnName]: number }
export type Permissions =
	| OperationPermission
	| Exclude<LevelPermission, "readOwnScope">
	| "tag"

/**
 * Permission group for post.
 *
 * This is safe to use in client-side.
 */
export default class extends PermissionGroup<PostFlags, Permissions> {
	get name(): string { return postColumnName }

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

			[ "readDepartmentScope", {
				"flag": READ_DEPARTMENT_SCOPE,
				"mask": READ_SCOPE_MASK,
				"permissionDependencies": [ ]
			} ],
			[ "readOverallScope", {
				"flag": READ_OVERALL_SCOPE,
				"mask": READ_SCOPE_MASK,
				"permissionDependencies": [ ]
			} ],
			[ "writeOwnScope", {
				"flag": WRITE_OWN_SCOPE,
				"mask": WRITE_SCOPE_MASK,
				"permissionDependencies": [ ]
			} ],
			[ "writeDepartmentScope", {
				"flag": WRITE_DEPARTMENT_SCOPE,
				"mask": WRITE_SCOPE_MASK,
				"permissionDependencies": [ "readDepartmentScope" ]
			} ],
			[ "writeOverallScope", {
				"flag": WRITE_OVERALL_SCOPE,
				"mask": WRITE_SCOPE_MASK,
				"permissionDependencies": [ "readOverallScope" ]
			} ],
			[ "tag", {
				"flag": 0x0100,
				"mask": 0x0100,
				"permissionDependencies": [ "view" ]
			} ]
		])
	}
}
