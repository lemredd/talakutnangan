import Semester from "%/models/audit_trail"
import SemesterFactory from "~/factories/audit_trail"

import siftBySlug from "./sift_by_slug"

describe("Database Pipe: Sift by slug", () => {
	it("can find all", async() => {
		const auditTrail = await new SemesterFactory().insertOne()
		const slug = ""

		const options = siftBySlug({}, { "filter": { slug } })
		const foundSemesters = await Semester.findAll(options)

		expect(options).not.toHaveProperty("include")
		expect(foundSemesters).toHaveLength(1)
		expect(foundSemesters).toHaveProperty("0.id", auditTrail.id)
	})

	it("can find on specific using name", async() => {
		const auditTrail = await new SemesterFactory()
		.actionName(() => "firstauditTrail")
		.insertOne()
		await new SemesterFactory()
		.actionName(() => "secondauditTrail")
		.insertOne()
		const slug = "fir"

		const options = siftBySlug({}, { "filter": { slug } })
		const foundSemesters = await Semester.findAll(options)

		expect(options).toHaveProperty("where")
		expect(foundSemesters).toHaveLength(1)
		expect(foundSemesters).toHaveProperty("0.id", auditTrail.id)
	})

	it("cannot find on incorrect slug", async() => {
		await new SemesterFactory()
		.actionName(() => "firstauditTrail")
		.insertOne()
		await new SemesterFactory()
		.actionName(() => "secondauditTrail")
		.insertOne()
		const slug = "xx"

		const options = siftBySlug({}, { "filter": { slug } })
		const foundSemesters = await Semester.findAll(options)

		expect(options).toHaveProperty("where")
		expect(foundSemesters).toHaveLength(0)
	})
})
