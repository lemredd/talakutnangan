import Model from "%/models/post"
import Factory from "~/factories/post"
import DepartmentFactory from "~/factories/department"

import siftByDepartment from "./sift_by_department"

describe("Database Pipe: Sift by department", () => {
	it("can find on specific department", async() => {
		const department = await new DepartmentFactory().insertOne()
		const model = await new Factory().department(() => Promise.resolve(department)).insertOne()

		const options = siftByDepartment({}, {
			"filter": {
				"departmentID": department.id
			}
		})
		const foundModels = await Model.findAll(options)

		expect(options).toHaveProperty("where")
		expect(foundModels).toHaveLength(1)
		expect(foundModels).toHaveProperty("0.id", model.id)
	})

	it("cannot find on empty department", async() => {
		const departmentA = await new DepartmentFactory().insertOne()
		const departmentB = await new DepartmentFactory().insertOne()
		await new Factory().department(() => Promise.resolve(departmentA)).insertOne()

		const options = siftByDepartment({}, {
			"filter": {
				"departmentID": departmentB.id
			}
		})
		const foundModels = await Model.findAll(options)

		expect(options).toHaveProperty("where")
		expect(foundModels).toHaveLength(0)
	})
})
