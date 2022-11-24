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

const tagColumnName = "tagFlags"

type TagFlags = { [tagColumnName]: number }
export type Permissions = OperationPermission

/**
 * Permission group for tag.
 *
 * This is safe to use in client-side.
 */
export default class extends PermissionGroup<TagFlags, Permissions> {
	get name(): string { return tagColumnName }

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
