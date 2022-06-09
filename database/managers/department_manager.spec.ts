import DepartmentManager from "./department_manager"
import DepartmentFactory from "~/factories/department"
import Department from "%/models/department"

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

	it("can create department", async () => {
		const manager = new DepartmentManager()
		const department = await (new DepartmentFactory()).makeOne()

		const createdDepartment = await manager.create(department.toJSON())

		expect(createdDepartment.fullName).toStrictEqual(department.fullName)
	})

	it("can update department", async () => {
		const manager = new DepartmentManager()
		const department = await (new DepartmentFactory()).insertOne()
		department.mayAdmit = !department.mayAdmit

		const updateCount = await manager.update(department.id, {
			mayAdmit: !department.mayAdmit
		})

		expect(updateCount).toBe(1)
		expect((
			await Department.findOne({
				where: { id: department.id }
			})
		).mayAdmit).not.toBe(department.mayAdmit)
	})

	it("archive department", async () => {
		const manager = new DepartmentManager()
		const department = await (new DepartmentFactory()).insertOne()

		const deleteCount = await manager.archive(department.id)

		expect(deleteCount).toBe(1)
		expect((
			await Department.findOne({
				where: { id: department.id },
				paranoid: true
			})
		)?.deletedAt).not.toBeNull()
	})

	it("restore department", async () => {
		const manager = new DepartmentManager()
		const department = await (new DepartmentFactory()).insertOne()
		await department.destroy({force: false})

		await manager.restore(department.id)

		expect((
			await Department.findOne({
				where: { id: department.id }
			})
		).deletedAt).toBeNull()
	})
})
