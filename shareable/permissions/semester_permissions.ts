import type {
	PermissionMap,
	PermissionInfo,
	OperationPermission,
} from "$/types/server"

import {
	VIEW,
	CREATE,
	UPDATE,
	ARCHIVE_AND_RESTORE
} from "$/types/server"

import PermissionGroup from "$/permissions/base"

const semesterColumnName = "semesterFlags"

type SemesterFlags = { [semesterColumnName]: number }
type Permissions = OperationPermission

/**
 * Permission group for semester.
 *
 * This is safe to use in client-side.
 */
export default class extends PermissionGroup<SemesterFlags, Permissions> {
	get name(): string { return semesterColumnName }

	get permissions(): PermissionMap<Permissions> {
		return new Map<Permissions, PermissionInfo<Permissions>>([
			[ "view",              { flag: VIEW, permissionDependencies: [] } ],
			[ "create",            { flag: CREATE, permissionDependencies: [ "view" ] } ],
			[ "update",            { flag: UPDATE, permissionDependencies: [ "view" ] } ],
			[ "archiveAndRestore", { flag: ARCHIVE_AND_RESTORE, permissionDependencies: [ "view" ] } ],
		])
	}
}