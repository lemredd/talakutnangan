import { JSON_API_MEDIA_TYPE } from "!/types/independent"

import App from "~/set-ups/app"
import RoleFactory from "~/factories/role"
import DepartmentFactory from "~/factories/department"
import { CREATE } from "$/permissions/department_combinations"
import RequestEnvironment from "$!/singletons/request_environment"
import { department as permissionGroup } from "$/permissions/permission_list"

import Route from "!/app/routes/api/department/create.post"

describe("POST /api/department/create", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async () => {
		const adminRole = await new RoleFactory()
			.departmentFlags(permissionGroup.generateMask(...CREATE))
			.insertOne()
		const { user, cookie } = await App.makeAuthenticatedCookie(adminRole)
		const department = await (new DepartmentFactory()).makeOne()

		const response = await App.request
			.post("/api/department/create")
			.set("Cookie", cookie)
			.send({
				acronym: department.acronym,
				fullName: department.fullName,
				mayAdmit: department.mayAdmit
			})

		expect(response.statusCode).toBe(RequestEnvironment.status.CREATED)
		expect(response.body.data.attributes.acronym).toBe(department.acronym)
		expect(response.body.data.attributes.fullName).toBe(department.fullName)
		expect(response.body.data.attributes.mayAdmit).toBe(department.mayAdmit)
	})

	it("cannot accept invalid info", async () => {
		const adminRole = await new RoleFactory()
			.departmentFlags(permissionGroup.generateMask(...CREATE))
			.insertOne()
		const { user, cookie } = await App.makeAuthenticatedCookie(adminRole)
		const department = await (new DepartmentFactory()).makeOne()
		const randomData = await (new DepartmentFactory()).makeOne() // Used for generate random data

		const response = await App.request
			.post("/api/department/create")
			.set("Cookie", cookie)
			.accept(JSON_API_MEDIA_TYPE)
			.send({
				acronym: department.acronym+randomData.acronym,
				fullName: department.fullName + "1",
				mayAdmit: "123"
			})

		expect(response.statusCode).toBe(RequestEnvironment.status.BAD_REQUEST)
		expect(response.body.errors).toHaveLength(3)
		expect(response.body).toHaveProperty("errors.0.source.pointer", "fullName")
		expect(response.body).toHaveProperty("errors.1.source.pointer", "acronym")
		expect(response.body).toHaveProperty("errors.2.source.pointer", "mayAdmit")
	})
})
