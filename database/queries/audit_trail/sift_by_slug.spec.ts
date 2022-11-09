import AuditTrail from "%/models/audit_trail"
import AuditTrailFactory from "~/factories/audit_trail"

import siftBySlug from "./sift_by_slug"

describe("Database Pipe: Sift by slug", () => {
	it("can find all", async() => {
		const auditTrail = await new AuditTrailFactory().insertOne()
		const slug = ""

		const options = siftBySlug({}, { "filter": { slug } })
		const foundAuditTrails = await AuditTrail.findAll(options)

		expect(options).not.toHaveProperty("include")
		expect(foundAuditTrails).toHaveLength(1)
		expect(foundAuditTrails).toHaveProperty("0.id", auditTrail.id)
	})

	it("can find on specific using name", async() => {
		const auditTrail = await new AuditTrailFactory()
		.actionName(() => "firstauditTrail")
		.insertOne()
		await new AuditTrailFactory()
		.actionName(() => "secondauditTrail")
		.insertOne()
		const slug = "fir"

		const options = siftBySlug({}, { "filter": { slug } })
		const foundAuditTrails = await AuditTrail.findAll(options)

		expect(options).toHaveProperty("where")
		expect(foundAuditTrails).toHaveLength(1)
		expect(foundAuditTrails).toHaveProperty("0.id", auditTrail.id)
	})

	it("cannot find on incorrect slug", async() => {
		await new AuditTrailFactory()
		.actionName(() => "firstauditTrail")
		.insertOne()
		await new AuditTrailFactory()
		.actionName(() => "secondauditTrail")
		.insertOne()
		const slug = "xx"

		const options = siftBySlug({}, { "filter": { slug } })
		const foundAuditTrails = await AuditTrail.findAll(options)

		expect(options).toHaveProperty("where")
		expect(foundAuditTrails).toHaveLength(0)
	})
})
