import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/set-ups/app"
import RoleFactory from "~/factories/role"
import DepartmentFactory from "~/factories/department"

import { READ } from "$/permissions/department_combinations"
import RequestEnvironment from "$!/singletons/request_environment"
import { department as permissionGroup } from "$/permissions/permission_list"

import Route from "!%/api/department/list.get"

describe("GET /api/deparment/list", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by permitted user and get departments", async () => {
		const anyRole = await new RoleFactory()
			.departmentFlags(permissionGroup.generateMask(...READ))
			.insertOne()
		const departments = (await (new DepartmentFactory()).insertMany(3)).sort((a, b) => {
			return a.id === b.id ? 0 : a.id < b.id ? -1 : 1
		})
		const { user: admin, cookie } = await App.makeAuthenticatedCookie(anyRole, factory => {
			return factory.in(departments[0])
		})

		const response = await App.request
			.get("/api/department/list")
			.query({ sort: "id" })
			.set("Cookie", cookie)
			.type(JSON_API_MEDIA_TYPE)
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toHaveProperty("data.0.type", "department")
		expect(response.body).toHaveProperty("data.0.attributes.fullName", departments[0].fullName)
		expect(response.body).toHaveProperty("data.1.attributes.fullName", departments[1].fullName)
		expect(response.body).toHaveProperty("data.2.attributes.fullName", departments[2].fullName)
	})

	it("can be accessed by permitted user but get departments in descending order", async () => {
		const anyRole = await new RoleFactory()
			.departmentFlags(permissionGroup.generateMask(...READ))
			.insertOne()
		const departments = (await (new DepartmentFactory()).insertMany(3)).sort((a, b) => {
			return a.fullName.localeCompare(b.fullName)
		})
		const { user: admin, cookie } = await App.makeAuthenticatedCookie(anyRole, factory => {
			return factory.in(departments[0])
		})

		const response = await App.request
			.get("/api/department/list")
			.query({ sort: "-fullName" })
			.set("Cookie", cookie)
			.type(JSON_API_MEDIA_TYPE)
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toHaveProperty("data.0.type", "department")
		expect(response.body).toHaveProperty("data.0.attributes.fullName", departments[2].fullName)
		expect(response.body).toHaveProperty("data.1.attributes.fullName", departments[1].fullName)
		expect(response.body).toHaveProperty("data.2.attributes.fullName", departments[0].fullName)
	})

	it("can be accessed by permitted user but get archived departments", async () => {
		const anyRole = await new RoleFactory()
			.departmentFlags(permissionGroup.generateMask(...READ))
			.insertOne()
		const { user: admin, cookie } = await App.makeAuthenticatedCookie(anyRole)
		const departments = (await (new DepartmentFactory()).insertMany(3)).sort((a, b) => {
			return a.fullName.localeCompare(b.fullName)
		})
		await departments[0].destroy()
		await departments[2].destroy()

		const response = await App.request
			.get("/api/department/list?filter[existence]=archived&sort=fullName")
			.set("Cookie", cookie)
			.type(JSON_API_MEDIA_TYPE)
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toHaveProperty("data.0.attributes.fullName", departments[0].fullName)
		expect(response.body).toHaveProperty("data.1.attributes.fullName", departments[2].fullName)
	})
})
