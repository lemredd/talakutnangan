import Role from "%/models/department"
import RoleFactory from "~/factories/department"

import siftBySlug from "./sift_by_slug"

describe("Database Pipe: Sift by slug", () => {
	it("can find all", async() => {
		const department = await new RoleFactory().insertOne()
		const slug = ""

		const options = siftBySlug({}, { "filter": { slug } })
		const foundRoles = await Role.findAll(options)

		expect(options).not.toHaveProperty("include")
		expect(foundRoles).toHaveLength(1)
		expect(foundRoles).toHaveProperty("0.id", department.id)
	})

	it("can find on specific using fullName", async() => {
		const department = await new RoleFactory()
		.fullName(() => "firstDepartment")
		.insertOne()
		await new RoleFactory()
		.fullName(() => "secondDepartment")
		.insertOne()
		const slug = "fir"

		const options = siftBySlug({}, { "filter": { slug } })
		const foundRoles = await Role.findAll(options)

		expect(options).toHaveProperty("where")
		expect(foundRoles).toHaveLength(1)
		expect(foundRoles).toHaveProperty("0.id", department.id)
	})

	it("cannot find on incorrect slug", async() => {
		await new RoleFactory()
		.fullName(() => "firstDepartment")
		.insertOne()
		await new RoleFactory()
		.fullName(() => "secondDepartment")
		.insertOne()
		const slug = "xx"

		const options = siftBySlug({}, { "filter": { slug } })
		const foundRoles = await Role.findAll(options)

		expect(options).toHaveProperty("where")
		expect(foundRoles).toHaveLength(0)
	})
})
