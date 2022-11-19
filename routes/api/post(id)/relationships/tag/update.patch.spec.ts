import TagFactory from "~/factories/tag"
import PostFactory from "~/factories/post"
import UserFactory from "~/factories/user"
import RoleFactory from "~/factories/role"
import PostTagFactory from "~/factories/post_tag"

import ErrorBag from "$!/errors/error_bag"
import MockRequester from "~/setups/mock_requester"
import AuthorizationError from "$!/errors/authorization"

import { post as permissionGroup } from "$/permissions/permission_list"
import {
	TAG_PUBLIC_POST_ON_ANY_DEPARTMENT,
	TAG_SOCIAL_POST_ON_OWN_DEPARTMENT
} from "$/permissions/post_combinations"

import Controller from "./update.patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/post/:id/relationships/tag", () => {
	const requester = new MockRequester()

	it("can allow other user", async() => {
		const controller = new Controller()
		const { policy } = controller
		const policyFunction = policy.intermediate.bind(policy)
		const tag = await new TagFactory().insertOne()
		const post = await new PostFactory().insertOne()
		await new PostTagFactory()
		.post(() => Promise.resolve(post))
		.tag(() => Promise.resolve(tag))
		.insertOne()

		const adminRole = await new RoleFactory().userFlags(
			permissionGroup.generateMask(...TAG_PUBLIC_POST_ON_ANY_DEPARTMENT)
		).insertOne()
		const admin = await new UserFactory()
		.beReachableEmployee()
		.attach(adminRole)
		.serializedOne(true)
		requester.customizeRequest({
			"isAuthenticated": jest.fn(() => true),
			"params": {
				"id": post.id
			},
			"user": {
				...admin,
				"meta": {
					"hasDefaultPassword": false
				}
			}
		})

		await requester.runMiddleware(policyFunction)

		requester.expectSuccess()
	})

	it("cannot allow user to edit tags if not permitted", async() => {
		const controller = new Controller()
		const { policy } = controller
		const policyFunction = policy.intermediate.bind(policy)
		const tag = await new TagFactory().insertOne()
		const post = await new PostFactory().insertOne()
		await new PostTagFactory()
		.post(() => Promise.resolve(post))
		.tag(() => Promise.resolve(tag))
		.insertOne()

		const deanRole = await new RoleFactory().userFlags(
			permissionGroup.generateMask(...TAG_SOCIAL_POST_ON_OWN_DEPARTMENT)
		).insertOne()
		const dean = await new UserFactory()
		.beReachableEmployee()
		.attach(deanRole)
		.serializedOne(true)
		requester.customizeRequest({
			"isAuthenticated": jest.fn(() => true),
			"params": {
				"id": dean.data.id
			},
			"user": {
				...dean,
				"meta": {
					"hasDefaultPassword": false
				}
			}
		})

		await requester.runMiddleware(policyFunction)

		requester.expectFailure(AuthorizationError)
	})

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const validation = validations[BODY_VALIDATION_INDEX]
		const validationFunction = validation.intermediate.bind(validation)
		const models = await new TagFactory().insertMany(2)
		requester.customizeRequest({
			"body": {
				"data": [
					{
						"id": String(models[0].id),
						"type": "tag"
					},
					{
						"id": String(models[1].id),
						"type": "tag"
					}
				]
			}
		})

		await requester.runMiddleware(validationFunction)

		requester.expectSuccess()
	})

	it("cannot accept invalid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const validation = validations[BODY_VALIDATION_INDEX]
		const validationFunction = validation.intermediate.bind(validation)
		const models = await new TagFactory().insertMany(2)
		requester.customizeRequest({
			"body": {
				"data": [
					{
						"id": String(models[0].id),
						"type": "tag"
					},
					{
						"id": String(models[1].id + 3),
						"type": "tag"
					}
				]
			}
		})

		await requester.runMiddleware(validationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.1.id")
	})
})
