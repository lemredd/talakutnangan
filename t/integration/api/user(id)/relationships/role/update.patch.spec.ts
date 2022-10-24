import { JSON_API_MEDIA_TYPE } from "$/types/server"

import { UPDATE_ROLE_OF_USER_LINK } from "$/constants/template_links"

import App from "~/setups/app"
import Factory from "~/factories/user"
import RoleFactory from "~/factories/role"
import AttachedRole from "%/models/attached_role"
import specializePath from "$/helpers/specialize_path"
import RequestEnvironment from "$!/singletons/request_environment"

import { user as permissionGroup } from "$/permissions/permission_list"
import { UPDATE_ANYONE_ON_ALL_DEPARTMENTS } from "$/permissions/user_combinations"

import Route from "!%/api/user(id)/relationships/role/update.patch"

describe("PATCH /api/user/:id/relationships/role", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can update attached roles", async() => {
		const adminRole = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...UPDATE_ANYONE_ON_ALL_DEPARTMENTS))
		.insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(adminRole)
		const roles = await new RoleFactory().insertMany(3)
		const model = await new Factory().attach(roles[0]).attach(roles[1]).insertOne()

		const response = await App.request
		.patch(specializePath(UPDATE_ROLE_OF_USER_LINK, { "id": model.id }))
		.send({
			"data": [
				{
					"id": String(roles[1].id),
					"type": "role"
				},
				{
					"id": String(roles[2].id),
					"type": "role"
				}
			]
		})
		.set("Cookie", cookie)
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
		const { count, rows } = await AttachedRole.findAndCountAll()
		expect(count).toBe(4)
		expect(rows).toHaveProperty("2.roleID", roles[1].id)
		expect(rows).toHaveProperty("3.roleID", roles[2].id)
	})
})
