import App from "~/set-ups/app"
import RoleFactory from "~/factories/role"
import DepartmentFactory from "~/factories/department"
import { UPDATE } from "$/permissions/department_combinations"
import RequestEnvironment from "$!/singletons/request_environment"
import { department as permissionGroup } from "$/permissions/permission_list"

import Route from "!/app/routes/api/department/update.put"

describe("PUT /api/department/update", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async () => {
		const adminRole = await new RoleFactory()
			.departmentFlags(permissionGroup.generateMask(...UPDATE))
			.insertOne()
		const { user, cookie } = await App.makeAuthenticatedCookie(adminRole)
		const department = await (new DepartmentFactory()).insertOne()
		const newDepartmentDetails = await (new DepartmentFactory()).makeOne()

		const response = await App.request
			.put("/api/department/update")
			.set("Cookie", cookie)
			.send({
				id: department.id,
				acronym: newDepartmentDetails.acronym,
				fullName: newDepartmentDetails.fullName,
				mayAdmit: newDepartmentDetails.mayAdmit
			})

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
	})

	it.todo("cannot accept invalid values")
	it.todo("cannot update missing model")

	it("cannot be accessed without correct permission", async () => {
		const anyRole = await new RoleFactory()
			.departmentFlags(permissionGroup.generateMask("view"))
			.insertOne()
		const { user, cookie } = await App.makeAuthenticatedCookie(anyRole)
		const department = await (new DepartmentFactory()).insertOne()
		const newDepartmentDetails = await (new DepartmentFactory()).makeOne()

		const response = await App.request
			.put("/api/department/update")
			.set("Cookie", cookie)
			.send({
				id: department.id,
				acronym: newDepartmentDetails.acronym,
				fullName: newDepartmentDetails.fullName,
				mayAdmit: newDepartmentDetails.mayAdmit
			})

		expect(response.statusCode).toBe(RequestEnvironment.status.UNAUTHORIZED)
	})

	it("cannot be accessed by guest users", async () => {
		const department = await (new DepartmentFactory()).insertOne()
		const newDepartmentDetails = await (new DepartmentFactory()).makeOne()

		const response = await App.request
			.put("/api/department/update")
			.send({
				id: department.id,
				acronym: newDepartmentDetails.acronym,
				fullName: newDepartmentDetails.fullName,
				mayAdmit: newDepartmentDetails.mayAdmit
			})

		expect(response.statusCode).toBe(RequestEnvironment.status.UNAUTHORIZED)
	})
})
