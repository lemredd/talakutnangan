import Department from "%/models/department"
import DepartmentFactory from "~/factories/department"

import siftBySlug from "./sift_by_slug"

describe("Database Pipe: Sift by slug", () => {
	it("can find all", async() => {
		const department = await new DepartmentFactory().insertOne()
		const slug = ""

		const options = siftBySlug({}, { "filter": { slug } })
		const foundDepartments = await Department.findAll(options)

		expect(options).not.toHaveProperty("include")
		expect(foundDepartments).toHaveLength(1)
		expect(foundDepartments).toHaveProperty("0.id", department.id)
	})

	it("can find on specific using fullName", async() => {
		const department = await new DepartmentFactory()
		.fullName(() => "firstDepartment")
		.insertOne()
		await new DepartmentFactory()
		.fullName(() => "secondDepartment")
		.insertOne()
		const slug = "fir"

		const options = siftBySlug({}, { "filter": { slug } })
		const foundDepartments = await Department.findAll(options)

		expect(options).toHaveProperty("where")
		expect(foundDepartments).toHaveLength(1)
		expect(foundDepartments).toHaveProperty("0.id", department.id)
	})

	it("cannot find on incorrect slug", async() => {
		await new DepartmentFactory()
		.fullName(() => "firstDepartment")
		.insertOne()
		await new DepartmentFactory()
		.fullName(() => "secondDepartment")
		.insertOne()
		const slug = "xx"

		const options = siftBySlug({}, { "filter": { slug } })
		const foundDepartments = await Department.findAll(options)

		expect(options).toHaveProperty("where")
		expect(foundDepartments).toHaveLength(0)
	})
})
