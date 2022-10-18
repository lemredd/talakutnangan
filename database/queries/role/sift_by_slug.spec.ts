import Role from "%/models/role"
import RoleFactory from "~/factories/role"

import siftBySlug from "./sift_by_slug"

describe("Database Pipe: Sift by slug", () => {
	it("can find all", async() => {
		const role = await new RoleFactory().insertOne()
		const slug = ""

		const options = siftBySlug({}, { "filter": { slug } })
		const foundRoles = await Role.findAll(options)

		expect(options).not.toHaveProperty("include")
		expect(foundRoles).toHaveLength(1)
		expect(foundRoles).toHaveProperty("0.id", role.id)
	})

	it("can find on specific using name", async() => {
		const role = await new RoleFactory()
		.name(() => "firstRole")
		.insertOne()
		await new RoleFactory()
		.name(() => "secondRole")
		.insertOne()
		const slug = "fir"

		const options = siftBySlug({}, { "filter": { slug } })
		const foundRoles = await Role.findAll(options)

		expect(options).toHaveProperty("where")
		expect(foundRoles).toHaveLength(1)
		expect(foundRoles).toHaveProperty("0.id", role.id)
	})

	it("cannot find on incorrect slug", async() => {
		await new RoleFactory()
		.name(() => "firstRole")
		.insertOne()
		await new RoleFactory()
		.name(() => "secondRole")
		.insertOne()
		const slug = "xx"

		const options = siftBySlug({}, { "filter": { slug } })
		const foundRoles = await Role.findAll(options)

		expect(options).toHaveProperty("where")
		expect(foundRoles).toHaveLength(0)
	})
})
