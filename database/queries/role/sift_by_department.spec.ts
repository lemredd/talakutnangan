import Role from "%/models/role"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import DepartmentFactory from "~/factories/department"

import siftByDepartment from "./sift_by_department"

describe("Database Pipe: Sift by department", () => {
	it("can find all", async() => {
		const department = await new DepartmentFactory().insertOne()
		const role = await new RoleFactory().insertOne()
		await new UserFactory().in(department).attach(role).insertOne()

		const options = siftByDepartment({}, { "filter": { "department": "*" } })
		const foundRoles = await Role.findAll(options)

		expect(options).not.toHaveProperty("include")
		expect(foundRoles).toHaveLength(1)
		expect(foundRoles).toHaveProperty("0.id", role.id)
	})

	it("can find on specific department", async() => {
		const department = await new DepartmentFactory().insertOne()
		const role = await new RoleFactory().insertOne()
		await new UserFactory().in(department).attach(role).insertOne()

		const options = siftByDepartment({}, {
			"filter": {
				"department": department.id
			}
		})
		const foundRoles = await Role.findAll(options)

		expect(options).toHaveProperty("include.0")
		expect(foundRoles).toHaveLength(1)
		expect(foundRoles).toHaveProperty("0.id", role.id)
	})

	it("cannot find on empty department", async() => {
		const departmentA = await new DepartmentFactory().insertOne()
		const departmentB = await new DepartmentFactory().insertOne()
		const role = await new RoleFactory().insertOne()
		await new UserFactory().in(departmentA).attach(role).insertOne()

		const options = siftByDepartment({}, {
			"filter": {
				"department": departmentB.id
			}
		})
		const foundRoles = await Role.findAll(options)

		expect(options).toHaveProperty("include.0")
		expect(foundRoles).toHaveLength(0)
	})
})
