import User from "%/models/user"
import Department from "%/models/department"
import UserFactory from "~/factories/user"
import DepartmentFactory from "~/factories/department"

import siftByDepartment from "./sift_by_department"

describe("Database Pipe: Sift by department", () => {
	it("can find all", async() => {
		const department = await new DepartmentFactory().insertOne()
		const user = await new UserFactory().in(department).insertOne()

		const options = siftByDepartment({}, { "filter": { "department": "*" } })
		const foundUsers = await User.findAll(options)

		expect(options).not.toHaveProperty("include")
		expect(foundUsers).toHaveLength(1)
		expect(foundUsers).toHaveProperty("0.id", user.id)
	})

	it("can find on specific department", async() => {
		const department = await new DepartmentFactory().insertOne()
		const user = await new UserFactory().in(department).insertOne()

		const options = siftByDepartment({}, {
			"filter": {
				"department": department.id
			}
		})
		const foundUsers = await User.findAll(options)

		expect(options).toHaveProperty("include.0.where.id")
		expect(foundUsers).toHaveLength(1)
		expect(foundUsers).toHaveProperty("0.id", user.id)
		expect(foundUsers).toHaveProperty("0.department.id", department.id)
	})

	it("can find on with existing department model", async() => {
		const department = await new DepartmentFactory().insertOne()
		const user = await new UserFactory().in(department).insertOne()

		const options = siftByDepartment({ "include": [ Department ] }, {
			"filter": {
				"department": department.id
			}
		})
		const foundUsers = await User.findAll(options)

		expect(options).toHaveProperty("include.1.where.id")
		expect(foundUsers).toHaveLength(1)
		expect(foundUsers).toHaveProperty("0.id", user.id)
		expect(foundUsers).toHaveProperty("0.department.id", department.id)
	})

	it("cannot find on empty department", async() => {
		const departmentA = await new DepartmentFactory().insertOne()
		const departmentB = await new DepartmentFactory().insertOne()
		await new UserFactory().in(departmentA).insertOne()

		const options = siftByDepartment({}, {
			"filter": {
				"department": departmentB.id
			}
		})
		const foundUsers = await User.findAll(options)

		expect(options).toHaveProperty("include.0.where.id")
		expect(foundUsers).toHaveLength(0)
	})
})
