import { MULTIPART_MEDIA_TYPE, JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"
import RoleFactory from "~/factories/role"
import URLMaker from "$!/singletons/url_maker"
import RequestEnvironment from "$!/singletons/request_environment"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"

import { CREATE_PERSONAL_POST_ON_OWN_DEPARTMENT } from "$/permissions/post_combinations"
import { post as permissionGroup } from "$/permissions/permission_list"

import Route from "!%/api/post_attachment/create.post"

describe("POST /api/post_attachment", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can create post attachment", async() => {
		const PORT = 16000
		URLMaker.initialize("http", "localhost", PORT, "/")

		const employeeRole = await new RoleFactory()
		.postFlags(permissionGroup.generateMask(...CREATE_PERSONAL_POST_ON_OWN_DEPARTMENT))
		.insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(
			employeeRole,
			userFactory => userFactory.beReachableEmployee()
		)
		const path = `${RequestEnvironment.root}/t/data/logo_bg_transparent.png`
		const fileType = "image/png"

		const response = await App.request
		.post("/api/post_attachment")
		.field("data[type]", "post_attachment")
		.attach("data[attributes][fileContents]", path)
		.field("data[attributes][fileType]", fileType)
		.set("Cookie", cookie)
		.type(MULTIPART_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.CREATED)
		expect(response.body).toHaveProperty("data.type", "post_attachment")
		expect(response.body).toHaveProperty("data.id")
		expect(response.body).toHaveProperty("data.attributes.fileType", fileType)
		expect(response.body).toHaveProperty(
			"data.attributes.fileContents",
			`http://localhost:${PORT}/api/post_attachment/${response.body.data.id}`
		)
	}, convertTimeToMilliseconds("00:00:10"))
})
