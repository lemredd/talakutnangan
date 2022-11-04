import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"
import Factory from "~/factories/post"
import RoleFactory from "~/factories/role"
import CommentFactory from "~/factories/comment"
import RequestEnvironment from "$!/singletons/request_environment"

import { post as permissionGroup } from "$/permissions/permission_list"
import { READ_ANYONE_ON_ALL_DEPARTMENTS } from "$/permissions/post_combinations"

import Route from "!%/api/post/count_comments.get"

describe("GET /api/post/count_comments", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by permitted user and get user count", async() => {
		const adminRole = await new RoleFactory()
		.departmentFlags(permissionGroup.generateMask(...READ_ANYONE_ON_ALL_DEPARTMENTS))
		.insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(adminRole)
		const model = await new Factory().insertOne()
		const commentCount = 2
		await new CommentFactory().post(() => Promise.resolve(model)).insertMany(commentCount)

		const response = await App.request
		.get("/api/post/count_comments")
		.query({
			"filter": {
				"IDs": String(model.id)
			}
		})
		.set("Cookie", cookie)
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toHaveProperty("data.0.type", "post")
		expect(response.body).toHaveProperty("data.0.id", String(model.id))
		expect(response.body).toHaveProperty("data.0.meta.commentCount", commentCount)
		expect(response.body).not.toHaveProperty("data.1")
	})
})
