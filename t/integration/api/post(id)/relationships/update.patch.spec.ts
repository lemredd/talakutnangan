import { JSON_API_MEDIA_TYPE } from "$/types/server"

import { UPDATE_TAG_OF_POST_LINK } from "$/constants/template_links"

import App from "~/setups/app"
import Factory from "~/factories/post"
import PostTag from "%/models/post_tag"
import TagFactory from "~/factories/tag"
import RoleFactory from "~/factories/role"
import PostTagFactory from "~/factories/post_tag"
import specializePath from "$/helpers/specialize_path"
import RequestEnvironment from "$!/singletons/request_environment"

import { post as permissionGroup } from "$/permissions/permission_list"
import { TAG_PUBLIC_POST_ON_ANY_DEPARTMENT } from "$/permissions/post_combinations"

import Route from "!%/api/post(id)/relationships/tag/update.patch"

describe("PATCH /api/post/:id/relationships/tag", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can update attached tags", async() => {
		const adminRole = await new RoleFactory()
		.postFlags(permissionGroup.generateMask(...TAG_PUBLIC_POST_ON_ANY_DEPARTMENT))
		.insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(adminRole)
		const tags = await new TagFactory().insertMany(3)
		const model = await new Factory().insertOne()
		const initialTags = [ tags[0], tags[1] ]
		const initialTagIterator = initialTags.values()
		await new PostTagFactory()
		.post(() => Promise.resolve(model))
		.tag(() => Promise.resolve(initialTagIterator.next().value))
		.insertMany(initialTags.length)

		const response = await App.request
		.patch(specializePath(UPDATE_TAG_OF_POST_LINK, { "id": model.id }))
		.send({
			"data": [
				{
					"id": String(tags[1].id),
					"type": "tag"
				},
				{
					"id": String(tags[2].id),
					"type": "tag"
				}
			]
		})
		.set("Cookie", cookie)
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
		const { count, rows } = await PostTag.findAndCountAll()
		expect(count).toBe(2)
		expect(rows).toHaveProperty("0.tagID", tags[1].id)
		expect(rows).toHaveProperty("1.tagID", tags[2].id)
	})
})
