import DepartmentManager from "./department"
import DepartmentFactory from "~/factories/department"

describe("Database: Department Read Operations", () => {
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
