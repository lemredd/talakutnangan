import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"
import RoleFactory from "~/factories/role"
import DepartmentFactory from "~/factories/department"

import { READ } from "$/permissions/department_combinations"
import RequestEnvironment from "$!/singletons/request_environment"
import { department as permissionGroup } from "$/permissions/permission_list"

import Route from "!%/api/department/list.get"

describe("GET /api/deparment", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by permitted user and get departments", async() => {
		const anyRole = await new RoleFactory()
		.departmentFlags(permissionGroup.generateMask(...READ))
		.insertOne()
		const departments = (await new DepartmentFactory().insertMany(3))
		// eslint-disable-next-line no-nested-ternary, id-length, no-extra-parens
		.sort((a, b) => (a.id === b.id ? 0 : a.id < b.id ? -1 : 1))
		const { cookie } = await App.makeAuthenticatedCookie(
			anyRole,
			factory => factory.in(departments[0])
		)

		const response = await App.request
		.get("/api/department")
		.query({ "sort": "id" })
		.set("Cookie", cookie)
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toHaveProperty("data.0.type", "department")
		expect(response.body).toHaveProperty("data.0.attributes.fullName", departments[0].fullName)
		expect(response.body).toHaveProperty("data.1.attributes.fullName", departments[1].fullName)
		expect(response.body).toHaveProperty("data.2.attributes.fullName", departments[2].fullName)
	})

	it("can be accessed by permitted user but get departments in descending order", async() => {
		const anyRole = await new RoleFactory()
		.departmentFlags(permissionGroup.generateMask(...READ))
		.insertOne()
		const departments = (await new DepartmentFactory().insertMany(3))
		// eslint-disable-next-line id-length
		.sort((a, b) => a.fullName.localeCompare(b.fullName))
		const { cookie } = await App.makeAuthenticatedCookie(
			anyRole,
			factory => factory.in(departments[0])
		)

		const response = await App.request
		.get("/api/department")
		.query({ "sort": "-fullName" })
		.set("Cookie", cookie)
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toHaveProperty("data.0.type", "department")
		expect(response.body).toHaveProperty("data.0.attributes.fullName", departments[2].fullName)
		expect(response.body).toHaveProperty("data.1.attributes.fullName", departments[1].fullName)
		expect(response.body).toHaveProperty("data.2.attributes.fullName", departments[0].fullName)
	})

	it("can be accessed by permitted user but get archived departments", async() => {
		const anyRole = await new RoleFactory()
		.departmentFlags(permissionGroup.generateMask(...READ))
		.insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(anyRole)
		const departments = (await new DepartmentFactory().insertMany(3))
		// eslint-disable-next-line no-nested-ternary, id-length, no-extra-parens
		.sort((a, b) => a.fullName.localeCompare(b.fullName))
		await departments[0].destroy()
		await departments[2].destroy()

		const response = await App.request
		.get("/api/department?filter[existence]=archived&sort=fullName")
		.set("Cookie", cookie)
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toHaveProperty("data.0.attributes.fullName", departments[0].fullName)
		expect(response.body).toHaveProperty("data.1.attributes.fullName", departments[2].fullName)
	})
})
