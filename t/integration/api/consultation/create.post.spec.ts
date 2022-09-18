import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/set-ups/app"

import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import Factory from "~/factories/consultation"
import RequestEnvironment from "$!/singletons/request_environment"

import Route from "!%/api/consultation/create.post"

describe("POST /api/consultation", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async() => {
		const normalRole = await new RoleFactory().insertOne()
		const { user, cookie } = await App.makeAuthenticatedCookie(
			normalRole,
			userFactory => userFactory.beStudent())
		const consultant = await new UserFactory()
		.beReachableEmployee()
		.attach(normalRole)
		.insertOne()
		const model = await new Factory()
		.startedAt(() => null)
		.finishedAt(() => null)
		.makeOne()

		const response = await App.request
		.post("/api/consultation")
		.set("Cookie", cookie)
		.send({
			"data": {
				"attributes": {
					"actionTaken": model.actionTaken,
					"attachedRoleID": model.attachedRoleID,
					"finishedAt": model.finishedAt,
					"reason": model.reason,
					"scheduledStartAt": model.scheduledStartAt.toJSON()
				},
				"relationships": {
					"consultant": {
						"data": {
							"id": String(consultant.id),
							"type": "user"
						}
					},
					"consultantRole": {
						"data": {
							"id": String(normalRole.id),
							"type": "role"
						}
					},
					"participants": {
						"data": [
							{
								"id": String(user.id),
								"type": "user"
							}
						]
					}
				},
				"type": "consultation"
			},
			"meta": {
				"doesAllowConflicts": true
			}
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.CREATED)
		expect(response.body.data.attributes.reason).toStrictEqual(model.reason)
	})
})
