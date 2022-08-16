import type { DeserializedUserProfile } from "$/types/documents/user"
import type { Request, Response, NextFunction } from "!/types/dependent"
import Middleware from "!/bases/middleware"
import deserialize from "$/helpers/deserialize"
import AuditTrailManager from "%/managers/audit_trail"

/**
 * A post job to audit the actions done by user.
 */
export default class ActionAuditor extends Middleware {
	private actionName: string

	constructor(actionName: string) {
		super()
		this.actionName = actionName
	}

	async intermediate(request: Request, response: Response, next: NextFunction)
	: Promise<void> {
		const manager = new AuditTrailManager(request.transaction, request.cache)
		const user = request.user
			? deserialize(request.user) as DeserializedUserProfile
			: null
		const userID = user ? Number(user.data.id) : null

		await manager.create({
			"actionName": this.actionName,
			"extra": {},
			userID
		})

		next()
	}
}
