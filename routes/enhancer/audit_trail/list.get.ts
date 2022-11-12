import type { Serializable } from "$/types/general"
import type { DocumentProps } from "$/types/server"
import type { AuthenticatedRequest } from "!/types/dependent"

import Policy from "!/bases/policy"
import Manager from "%/managers/audit_trail"
import PageMiddleware from "!/bases/controller-likes/page_middleware"

import PermissionBasedPolicy from "!/policies/permission-based"
import { auditTrail as permissionGroup } from "$/permissions/permission_list"
import { READ } from "$/permissions/audit_trail_combinations"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ
		])
	}

	getDocumentProps(): DocumentProps {
		return {
			"description": "List of audit trails in Talakutnangan",
			"title": "Audit Trail List | Talakutnangan"
		}
	}

	async getPageProps(request: AuthenticatedRequest): Promise<Serializable> {
		const manager = new Manager(request)

		const auditTrails = await manager.list({
			"filter": {
				"existence": "exists",
				"slug": ""
			},
			"page": {
				"limit": 10,
				"offset": 0
			},
			"sort": [ "-createdAt" ]
		})

		return {
			auditTrails
		}
	}
}
