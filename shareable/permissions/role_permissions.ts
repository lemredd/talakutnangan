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

const roleColumnName = "roleFlags"

type RoleFlags = { [roleColumnName]: number }
type Permissions = OperationPermission

/**
 * Permission group for role.
 *
 * This is safe to use in client-side.
 */
export default class extends PermissionGroup<RoleFlags, Permissions> {
	get name(): string { return roleColumnName }

	get permissions(): PermissionMap<Permissions> {
		return new Map<Permissions, PermissionInfo<Permissions>>([
			[ "view",              { flag: VIEW, permissionDependencies: [] } ],
			[ "create",            { flag: CREATE, permissionDependencies: [ "view" ] } ],
			[ "update",            { flag: UPDATE, permissionDependencies: [ "view" ] } ],
			[ "archiveAndRestore", { flag: ARCHIVE_AND_RESTORE, permissionDependencies: [ "view" ] } ],
		])
	}
}