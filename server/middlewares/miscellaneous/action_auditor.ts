import type { Request } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"

import deserialize from "$/object/deserialize"
import RequestFilter from "!/bases/request_filter"
import AuditTrailManager from "%/managers/audit_trail"

/**
 * A post job to audit the actions done by user.
 */
export default class ActionAuditor extends RequestFilter {
	private actionName: string

	constructor(actionName: string) {
		super()
		this.actionName = actionName
	}

	async filterRequest(request: Request): Promise<void> {
		const manager = new AuditTrailManager(request)
		const user = request.user
			? deserialize(request.user) as DeserializedUserProfile
			: null
		const userID = user ? Number(user.data.id) : null

		await manager.create({
			"actionName": this.actionName,
			"extra": {},
			userID
		})
	}
}
