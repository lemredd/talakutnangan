import { MULTIPART_MEDIA_TYPE, JSON_API_MEDIA_TYPE } from "$/types/server"

import flushPromises from "flush-promises"
import "~/set-ups/email.set_up"

import App from "~/set-ups/app"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import RequestEnvironment from "$!/singletons/request_environment"

import Transport from "!/helpers/email/transport"
import { UPDATE_OWN_DATA } from "$/permissions/user_combinations"
import { user as permissionGroup } from "$/permissions/permission_list"

import Route from "!%/api/user(id)/relationships/signature/update.patch"

describe("PATCH /api/user/:id/relationships/signature/update", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can upload valid student details", async () => {
		jest.setTimeout(10000)

		const studentRole = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...UPDATE_OWN_DATA))
			.insertOne()
		const { user: admin, cookie } = await App.makeAuthenticatedCookie(studentRole, userFactory => {
			return userFactory.beStudent()
		})
		const path = `${RequestEnvironment.root}/t/data/logo_bg_transparent.png`

		const response = await App.request
			.patch(`/api/user/${admin.id}/relationships/signature/update`)
			.field("data[type]", "signature")
			.attach("data[attributes][signature]", path)
			.set("Cookie", cookie)
			.type(MULTIPART_MEDIA_TYPE)
			.accept(JSON_API_MEDIA_TYPE)

			console.log(response.body, "\n\n\n\\n\n\n\n\n\n")
		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
	})
})
