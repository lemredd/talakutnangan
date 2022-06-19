import DepartmentManager from "./department"
import DepartmentFactory from "~/factories/department"
import Department from "%/models/department"

describe("Database: Department Read Operations", () => {
	it("can search department", async () => {
		const manager = new DepartmentManager()
		const department = await (new DepartmentFactory()).insertOne()
		const id = department.id

		const foundDepartment = await manager.findWithID(id)

		expect(foundDepartment!.fullName).toStrictEqual(department.fullName)
	})

	it("cannot search department", async () => {
		const manager = new DepartmentManager()
		const id = 0

		const foundDepartment = await manager.findWithID(id)

		expect(foundDepartment).toBeNull()
	})

	it("can search department with matching query", async () => {
		const manager = new DepartmentManager()
		const department = await (new DepartmentFactory()).insertOne()
		const incompleteName = department.fullName.slice(1)

		const roles = await manager.list({
			fullName: incompleteName,
			page: 0,
			limit: 1
		})

		expect(roles).toHaveProperty("data")
		expect(roles.data).toHaveLength(1)
	})

	it("cannot search department with non-matching query", async () => {
		const manager = new DepartmentManager()
		const department = await (new DepartmentFactory()).insertOne()
		const incorrectName = department.fullName + "1"

		const roles = await manager.list({
			fullName: incorrectName,
			page: 0,
			limit: 1
		})

		expect(roles).toHaveProperty("data")
		expect(roles.data).toHaveLength(0)
	})
})

describe("Database: Department Create Operations", () => {
	it("can create department", async () => {
		const manager = new DepartmentManager()
		const department = await (new DepartmentFactory()).makeOne()

		const createdDepartment = await manager.create(department.toJSON())

		expect(createdDepartment.fullName).toStrictEqual(department.fullName)
	})
})

describe("Database: Department Update Operations", () => {
	it("can update department", async () => {
		const manager = new DepartmentManager()
		const department = await (new DepartmentFactory()).insertOne()
		const originalMayAdmit = department.mayAdmit

		const updateCount = await manager.update(department.id, {
			acronym: department.acronym,
			fullName: department.fullName,
			mayAdmit: !originalMayAdmit
		})

		expect(updateCount).toBe(1)
		expect((
			await Department.findOne({
				where: { id: department.id }
			})
		)!.mayAdmit).not.toBe(department.mayAdmit)
	})
})

describe("Database: Department Archive and Restore Operations", () => {
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
		)!.deletedAt).toBeNull()
	})
})
