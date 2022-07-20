import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/set-ups/app"
import RoleFactory from "~/factories/role"
import Department from "%/models/department"
import DepartmentFactory from "~/factories/department"
import RequestEnvironment from "$!/singletons/request_environment"
import { ARCHIVE_AND_RESTORE } from "$/permissions/department_combinations"
import { department as permissionGroup } from "$/permissions/permission_list"

import Route from "!/app/routes/api/department/restore(id).patch"

describe("DELETE /api/department/restore/:id", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async () => {
		const adminRole = await new RoleFactory()
			.departmentFlags(permissionGroup.generateMask(...ARCHIVE_AND_RESTORE))
			.insertOne()
		const { user, cookie } = await App.makeAuthenticatedCookie(adminRole)
		const department = await (new DepartmentFactory()).insertOne()
		await department.destroy()

		const response = await App.request
			.patch(`/api/department/restore/${department.id}`)
			.set("Cookie", cookie)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
		expect(response.body).toStrictEqual({})
		expect((await Department.findOne({ where: { id: department.id } }))!.deletedAt).toBeNull()
	})

	it.todo("cannot restore non-existing")
	it.todo("cannot restore existing")

	it("cannot be accessed without correct permission", async () => {
		const anyRole = await new RoleFactory()
			.departmentFlags(permissionGroup.generateMask("view"))
			.insertOne()
		const { user, cookie } = await App.makeAuthenticatedCookie(anyRole)
		const department = await (new DepartmentFactory()).insertOne()
		await department.destroy()

		const response = await App.request
			.patch(`/api/department/restore/${department.id}`)
			.set("Cookie", cookie)
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.UNAUTHORIZED)
	})

	it("cannot be accessed by guest users", async () => {
		const department = await (new DepartmentFactory()).insertOne()

		const response = await App.request
			.patch(`/api/department/restore/${department.id}`)
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.UNAUTHORIZED)
	})
})
