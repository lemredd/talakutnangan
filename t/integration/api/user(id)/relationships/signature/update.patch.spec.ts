import { MULTIPART_MEDIA_TYPE, JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"
import RoleFactory from "~/factories/role"
import URLMaker from "$!/singletons/url_maker"
import StudentDetailFactory from "~/factories/student_detail"
import RequestEnvironment from "$!/singletons/request_environment"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"

import { UPDATE_OWN_DATA } from "$/permissions/user_combinations"
import { user as permissionGroup } from "$/permissions/permission_list"

import Route from "!%/api/user(id)/relationships/signature/update.patch"

describe("PATCH /api/user/:id/relationships/signature", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can update signature", async() => {
		const PORT = 16000
		URLMaker.initialize("http", "localhost", PORT, "/")

		const studentRole = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...UPDATE_OWN_DATA))
		.insertOne()
		const { user, cookie } = await App.makeAuthenticatedCookie(
			studentRole,
			userFactory => userFactory.beStudent()
		)
		const path = `${RequestEnvironment.root}/t/data/logo_bg_transparent.png`
		await new StudentDetailFactory().user(() => Promise.resolve(user)).insertOne()

		const response = await App.request
		.patch(`/api/user/${user.id}/relationships/signature`)
		.field("data[type]", "signature")
		.attach("data[attributes][fileContents]", path)
		.set("Cookie", cookie)
		.type(MULTIPART_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toHaveProperty("data.type", "signature")
		expect(response.body).toHaveProperty("data.id")
		expect(response.body).toHaveProperty(
			"data.attributes.fileContents",
			`http://localhost:16000/api/signature/${response.body.data.id}`
		)
	}, convertTimeToMilliseconds("00:00:10"))
})
