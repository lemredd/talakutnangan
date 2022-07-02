import App from "~/set-ups/app"
import RoleFactory from "~/factories/role"
import DepartmentFactory from "~/factories/department"
import { CREATE } from "$/permissions/department_combinations"
import RequestEnvironment from "!/helpers/request_environment"
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

		console.log("passed input", {
			acronym: department.acronym,
			fullName: department.fullName
		})

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body.data.attributes.acronym).toBe(department.acronym)
		expect(response.body.data.attributes.fullName).toBe(department.fullName)
		expect(response.body.data.attributes.mayAdmit).toBe(department.mayAdmit)
	})

	it("cannot accept invalid full name", async () => {
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
				fullName: department.fullName + "1",
				mayAdmit: department.mayAdmit
			})

		console.log("invalid input", {
			acronym: department.acronym,
			fullName: department.fullName + "1"
		})

		expect(response.statusCode).toBe(RequestEnvironment.status.BAD_REQUEST)
		expect(response.body).toHaveLength(1)
		expect(response.body).toHaveProperty([0, "field"], "fullName")
	})

	it("cannot accept invalid acronym", async () => {
		const adminRole = await new RoleFactory()
			.departmentFlags(permissionGroup.generateMask(...CREATE))
			.insertOne()
		const { user, cookie } = await App.makeAuthenticatedCookie(adminRole)
		const department = await (new DepartmentFactory()).makeOne()
		const randomData = await (new DepartmentFactory()).makeOne() // Used for generate random data

		const response = await App.request
			.post("/api/department/create")
			.set("Cookie", cookie)
			.send({
				acronym: department.acronym+randomData.acronym,
				fullName: department.fullName,
				mayAdmit: department.mayAdmit
			})

		expect(response.statusCode).toBe(RequestEnvironment.status.BAD_REQUEST)
		expect(response.body).toHaveLength(1)
		expect(response.body).toHaveProperty([0, "field"], "acronym")
	})

	it("cannot accept invalid value if it should be admitted", async () => {
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
				mayAdmit: "123"
			})

		expect(response.statusCode).toBe(RequestEnvironment.status.BAD_REQUEST)
		expect(response.body).toHaveLength(1)
		expect(response.body).toHaveProperty([0, "field"], "mayAdmit")
	})

	it("cannot create without correct permission", async () => {
		const anyRole = await new RoleFactory()
			.departmentFlags(permissionGroup.generateMask("view"))
			.insertOne()
		const { user, cookie } = await App.makeAuthenticatedCookie(anyRole)
		const department = await (new DepartmentFactory()).makeOne()

		const response = await App.request
			.post("/api/department/create")
			.set("Cookie", cookie)
			.send({
				acronym: department.acronym,
				fullName: department.fullName,
				mayAdmit: "123"
			})

		expect(response.statusCode).toBe(RequestEnvironment.status.UNAUTHORIZED)
	})

	it("cannot be accessed by guest users", async () => {
		const department = await (new DepartmentFactory()).makeOne()

		const response = await App.request
			.post("/api/department/create")
			.send({
				acronym: department.acronym,
				fullName: department.fullName,
				mayAdmit: department.mayAdmit
			})

		expect(response.statusCode).toBe(RequestEnvironment.status.UNAUTHORIZED)
	})
})
