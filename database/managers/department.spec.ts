import DepartmentManager from "./department"
import DepartmentFactory from "~/factories/department"

describe("Database: Department Read Operations", () => {
	it("can search department with matching query", async () => {
		const manager = new DepartmentManager()
		const department = await (new DepartmentFactory()).insertOne()
		const incompleteName = department.fullName.slice(1)

		const departments = await manager.list({
			fullName: incompleteName,
			filter: {
				existence: "exists"
			},
			sort: [],
			page: {
				offset: 0,
				limit: 5
			}
		})

		expect(departments).toHaveProperty("data")
		expect(departments.data).toHaveLength(1)
		expect(departments).toHaveProperty("data.0.type", "department")
		expect(departments).toHaveProperty("data.0.id", department.id)
		expect(departments).toHaveProperty("data.0.attributes.acronym", department.acronym)
		expect(departments).toHaveProperty("data.0.attributes.fullName", department.fullName)
		expect(departments).toHaveProperty("data.0.attributes.mayAdmit", department.mayAdmit)
	})

	it("cannot search department with non-matching query", async () => {
		const manager = new DepartmentManager()
		const department = await (new DepartmentFactory()).insertOne()
		const incorrectName = department.fullName + "1"

		const departments = await manager.list({
			fullName: incorrectName,
			filter: {
				existence: "exists"
			},
			sort: [],
			page: {
				offset: 0,
				limit: 5
			}
		})

		expect(departments).toHaveProperty("data")
		expect(departments.data).toHaveLength(0)
	})
})
