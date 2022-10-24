import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"

import Factory from "~/factories/comment"
import RoleFactory from "~/factories/role"
import PostFactory from "~/factories/post"
import RequestEnvironment from "$!/singletons/request_environment"

import { CREATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT } from "$/permissions/comment_combinations"
import {
	post as postPermissionGroup,
	comment as commentPermissionGroup
} from "$/permissions/permission_list"

import Route from "!%/api/comment/create.post"

describe("POST /api/comment", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async() => {
		const normalRole = await new RoleFactory()
		.commentFlags(commentPermissionGroup.generateMask(
			...CREATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
		))
		.postFlags(postPermissionGroup.generateMask(
			...commentPermissionGroup.identifyExternalDependencies(
				CREATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
			).filter(info => info.group.name === postPermissionGroup.name)
			.map(info => info.permissionDependencies)
			.flat()
		))
		.insertOne()
		const { user, cookie } = await App.makeAuthenticatedCookie(
			normalRole,
			userFactory => userFactory.beReachableEmployee()
		)
		const post = await new PostFactory().insertOne()
		const model = await new Factory().serializedOne()

		const response = await App.request
		.post("/api/comment")
		.set("Cookie", cookie)
		.send({
			"data": {
				"attributes": {
					"approvedAt": null,
					"content": model.data.attributes.content
				},
				"relationships": {
					"post": {
						"data": {
							"id": String(post.id),
							"type": "post"
						}
					},
					"user": {
						"data": {
							"id": String(user.id),
							"type": "user"
						}
					}
				},
				"type": "comment"
			}
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.CREATED)
		expect(response.body.data.attributes.content).toStrictEqual(model.data.attributes.content)
	})
})
