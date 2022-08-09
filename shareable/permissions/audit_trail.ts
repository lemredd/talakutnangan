import type { PermissionMap, PermissionInfo, OperationPermission } from "$/types/permission"
import { VIEW } from "$/types/permission"

import PermissionGroup from "$/permissions/base"

const auditTrailColumnName = "auditTrailFlags"

type AuditTrailFlags = { [auditTrailColumnName]: number }
export type Permissions = Extract<OperationPermission, "view">

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
