import { MULTIPART_MEDIA_TYPE, JSON_API_MEDIA_TYPE } from "$/types/server"

import "~/set-ups/email.set_up"

import App from "~/set-ups/app"
import RoleFactory from "~/factories/role"
import URLMaker from "$!/singletons/url_maker"
import RequestEnvironment from "$!/singletons/request_environment"

import { UPDATE_OWN_DATA } from "$/permissions/user_combinations"
import { user as permissionGroup } from "$/permissions/permission_list"

import Route from "!%/api/user(id)/relationships/signature/update.patch"

describe("PATCH /api/user/:id/relationships/signature/update", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can upload valid student details", async () => {
		jest.setTimeout(10000)

		URLMaker.initialize("http", "localhost", 16000, "/api")

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

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toHaveProperty("data.type", "signature")
		expect(response.body).toHaveProperty("data.id")
		expect(response.body).toHaveProperty(
			"data.links.self",
			"http://localhost:16000/api/signature/read/"+response.body.data.id
		)
	})
})
