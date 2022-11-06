import MockRequester from "~/setups/mock_requester"

import "~/setups/database.setup"
import AuditTrail from "%/models/audit_trail"

import Middleware from "./action_auditor"

describe("Middleware: Action Auditor", () => {
	const requester = new MockRequester()

	it("can redirect", async() => {
		const sender = new Middleware("type.name")

		await requester.runMiddleware(sender.intermediate.bind(sender))

		requester.expectSuccess()
		const auditTrails = await AuditTrail.findAll()
		expect(auditTrails).toHaveLength(1)
		expect(auditTrails).toHaveProperty("0.actionName", "type.name")
		expect(auditTrails).toHaveProperty("0.createdAt", "type.createdAt")
		expect(auditTrails).toHaveProperty("0.extra", { "isSensitive": false })
		expect(auditTrails).toHaveProperty("0.userID", null)
	})
})
