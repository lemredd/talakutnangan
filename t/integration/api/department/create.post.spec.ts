import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"
import RoleFactory from "~/factories/role"
import DepartmentFactory from "~/factories/department"
import { CREATE } from "$/permissions/department_combinations"
import RequestEnvironment from "$!/singletons/request_environment"
import { department as permissionGroup } from "$/permissions/permission_list"

import Route from "!%/api/department/create.post"

describe("POST /api/department", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async() => {
		const adminRole = await new RoleFactory()
		.departmentFlags(permissionGroup.generateMask(...CREATE))
		.insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(adminRole)
		const department = await new DepartmentFactory().makeOne()

		const response = await App.request
		.post("/api/department")
		.set("Cookie", cookie)
		.send({
			"data": {
				"type": "department",
				"attributes": {
					"acronym": department.acronym,
					"fullName": department.fullName,
					"mayAdmit": department.mayAdmit
				}
			}
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.CREATED)
		expect(response.body.data.attributes.acronym).toBe(department.acronym)
		expect(response.body.data.attributes.fullName).toBe(department.fullName)
		expect(response.body.data.attributes.mayAdmit).toBe(department.mayAdmit)
	})

	it("cannot accept invalid info", async() => {
		const adminRole = await new RoleFactory()
		.departmentFlags(permissionGroup.generateMask(...CREATE))
		.insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(adminRole)
		const department = await new DepartmentFactory().makeOne()
		// Used for generate random data
		const randomData = await new DepartmentFactory().makeOne()

		const response = await App.request
		.post("/api/department")
		.set("Cookie", cookie)
		.send({
			"data": {
				"type": "department",
				"attributes": {
					"acronym": department.acronym + randomData.acronym,
					"fullName": `${department.fullName}1`,
					"mayAdmit": "123"
				}
			}
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.BAD_REQUEST)
		expect(response.body.errors).toHaveLength(3)
		expect(response.body).toHaveProperty("errors.0.source.pointer", "data.attributes.acronym")
		expect(response.body).toHaveProperty("errors.1.source.pointer", "data.attributes.fullName")
		expect(response.body).toHaveProperty("errors.2.source.pointer", "data.attributes.mayAdmit")
	})
})
