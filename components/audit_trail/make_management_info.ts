import type { AuditTrailManagementInfo } from "$@/types/independent"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { DeserializedAuditTrailResource } from "$/types/documents/audit_trail"

import { auditTrail as permissionGroup } from "$/permissions/permission_list"
import {
	READ
} from "$/permissions/audit_trail_combinations"

export default function(
	userProfile: DeserializedUserProfile<"roles"|"department">,
	auditTrail: DeserializedAuditTrailResource
): AuditTrailManagementInfo {
	const isDeleted = Boolean(auditTrail.deletedAt)
	const roles = userProfile.data.roles.data

	const mayRead = permissionGroup.hasOneRoleAllowed(roles, [ READ ])

	return {
		isDeleted,
		mayRead
	}
}
