import DepartmentManager from "./department_manager"
import DepartmentFactory from "~/factories/department"

describe("Database: Search department with ID", () => {
	it("can search department", async () => {
		const manager = new DepartmentManager()
		const department = await (new DepartmentFactory()).insertOne()
		const id = department.id

		const foundDepartment = await manager.findWithID(id)

		expect(foundDepartment.fullName).toStrictEqual(department.fullName)
	})

	it("cannot search department", async () => {
		const manager = new DepartmentManager()
		const id = 0

		const foundDepartment = await manager.findWithID(id)

		expect(foundDepartment).toBeNull()
	})

	it.todo("can create department")
	it.todo("can update department")
	it.todo("archive department")
	it.todo("restore department")
})
