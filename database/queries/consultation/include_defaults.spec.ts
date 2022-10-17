import type { UserIdentifierDocument } from "$/types/documents/user"
import type { ConsultationResource } from "$/types/documents/consultation"

import Model from "%/models/consultation"
import UserFactory from "~/factories/user"
import Manager from "%/managers/consultation"
import Factory from "~/factories/consultation"
import ChatMessage from "%/models/chat_message"
import AttachedRoleFactory from "~/factories/attached_role"
import ChatMessageActivity from "%/models/chat_message_activity"

import includeDefaults from "./include_defaults"

describe("Database Pipe: Include defaults", () => {
	it("can read resource", async() => {
		const attachedRole = await new AttachedRoleFactory().insertOne()
		const user = await new UserFactory().insertOne()
		const model = await new Factory()
		.consultantInfo(() => Promise.resolve(attachedRole))
		.makeOne()
		const resource: ConsultationResource<"create"> = {
			"attributes": {
				"actionTaken": model.actionTaken,
				"deletedAt": null,
				"finishedAt": null,
				"reason": model.reason,
				"scheduledStartAt": new Date().toISOString(),
				"startedAt": null
			},
			// eslint-disable-next-line no-undefined
			"id": undefined,
			"relationships": {
				// eslint-disable-next-line no-undefined
				"chatMessageActivities": undefined,
				// eslint-disable-next-line no-undefined
				"chatMessages": undefined,
				"consultant": {
					"data": {
						"id": String(attachedRole.userID),
						"type": "user"
					}
				} as UserIdentifierDocument,
				"consultantRole": {
					"data": {
						"id": String(attachedRole.roleID),
						"type": "role"
					}
				},
				"participants": {
					"data": [
						{
							"id": String(user.id),
							"type": "user"
						},
						{
							"id": String(attachedRole.userID),
							"type": "user"
						}
					]
				}
			},
			"type": "consultation"
		}
		const manager = new Manager()
		await manager.createUsingResource(resource, user.id)

		const options = includeDefaults({}, {})
		const foundModels = await Model.findAll(options)

		expect(await Model.count()).toBe(1)
		expect(await ChatMessage.count()).toBe(1)
		expect(await ChatMessageActivity.count()).toBe(2)
		expect(foundModels).toHaveLength(1)
	})
})
