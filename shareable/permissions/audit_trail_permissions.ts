import type {
	PermissionMap,
	PermissionInfo,
	OperationPermission,
} from "$/types/server"

import {
	VIEW
} from "$/types/server"

import PermissionGroup from "$/permissions/base"

const auditTrailColumnName = "auditTrailFlags"

type AuditTrailFlags = { [auditTrailColumnName]: number }
type Permissions = OperationPermission

/**
 * Permission group for audit trails.
 *
 * This is safe to use in client-side.
 */
export default class extends PermissionGroup<AuditTrailFlags, Permissions> {
	get name(): string { return auditTrailColumnName }

	get permissions(): PermissionMap<Permissions> {
		return new Map<Permissions, PermissionInfo<Permissions>>([
			[ "view",              { flag: VIEW, permissionDependencies: [] } ]
		])
	}
}
