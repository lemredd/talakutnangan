import type { RawUser, Pipe } from "$/types/database"
import type {
	ModelCtor,
	FindAndCountOptions,
	TransformerOptions,
	AttributesObject
} from "%/types/dependent"
import { Op } from "sequelize"


import User from "%/models/user"
import Department from "%/models/department"
import UserFactory from "~/factories/user"
import DepartmentFactory from "~/factories/department"

import siftByDepartment from "./sift_by_department"

describe("Database Pipe: Sift by department", () => {
	it("can find all", async () => {
		const department = await new DepartmentFactory().insertOne()
		const user = await new UserFactory().in(department).insertOne()

		const options = siftByDepartment({}, { department: "*" })
		const foundUsers = await User.findAll(options)

		expect(options).not.toHaveProperty("include")
		expect(foundUsers).toHaveLength(1)
		expect(foundUsers).toHaveProperty("0.id", user.id)
	})

	it("can find on specific department", async () => {
		const department = await new DepartmentFactory().insertOne()
		const user = await new UserFactory().in(department).insertOne()

		const options = siftByDepartment({}, {
			department: department.fullName
		})
		const foundUsers = await User.findAll(options)

		expect(options).toHaveProperty("include.0.where.fullName")
		expect(foundUsers).toHaveLength(1)
		expect(foundUsers).toHaveProperty("0.id", user.id)
		expect(foundUsers).toHaveProperty("0.department.id", department.id)
	})

	it("can find on with existing department model", async () => {
		const department = await new DepartmentFactory().insertOne()
		const user = await new UserFactory().in(department).insertOne()

		const options = siftByDepartment({ include: [Department] }, {
			department: department.fullName
		})
		const foundUsers = await User.findAll(options)

		expect(options).toHaveProperty("include.1.where.fullName")
		expect(foundUsers).toHaveLength(1)
		expect(foundUsers).toHaveProperty("0.id", user.id)
		expect(foundUsers).toHaveProperty("0.department.id", department.id)
	})

	it("cannot find on empty department", async () => {
		const departmentA = await new DepartmentFactory().insertOne()
		const departmentB = await new DepartmentFactory().insertOne()
		const user = await new UserFactory().in(departmentA).insertOne()

		const options = siftByDepartment({}, {
			department: departmentB.fullName
		})
		const foundUsers = await User.findAll(options)

		expect(options).toHaveProperty("include.0.where.fullName")
		expect(foundUsers).toHaveLength(0)
	})
})
