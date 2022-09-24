import type { ConsultationResource } from "$/types/documents/consultation"

import Model from "%/models/consultation"
import UserFactory from "~/factories/user"
import Factory from "~/factories/consultation"
import ChatMessage from "%/models/chat_message"
import AttachedRoleFactory from "~/factories/attached_role"
import ChatMessageActivity from "%/models/chat_message_activity"
import ChatMessageActivityFactory from "~/factories/chat_message_activity"

import type { UserIdentifierDocument } from "$/types/documents/user"
import Manager from "./consultation"

describe("Database Manager: Consultation read operations", () => {
	it("can check if model belongs to user", async() => {
		const manager = new Manager()
		const user = await new UserFactory().insertOne()
		const model = await new Factory().insertOne()
		await new ChatMessageActivityFactory()
		.user(() => Promise.resolve(user))
		.consultation(() => Promise.resolve(model))
		.insertOne()

		const doesBelong = await manager.isModelBelongsTo(model.id, user.id, manager.modelChainToUser)

		expect(doesBelong).toBeTruthy()
	})

	it("can start without other started consultation", async() => {
		const manager = new Manager()
		const user = await new UserFactory().insertOne()
		const attachedRole = await new AttachedRoleFactory()
		.user(() => Promise.resolve(user))
		.insertOne()
		const model = await new Factory()
		.consultantInfo(() => Promise.resolve(attachedRole))
		.startedAt(() => null)
		.insertOne()

		const canStart = await manager.canStart(model.id)

		expect(canStart).toBeTruthy()
	})

	it("can start because same consultation already starts", async() => {
		const manager = new Manager()
		const user = await new UserFactory().insertOne()
		const attachedRole = await new AttachedRoleFactory()
		.user(() => Promise.resolve(user))
		.insertOne()
		const model = await new Factory()
		.consultantInfo(() => Promise.resolve(attachedRole))
		.startedAt(() => new Date())
		.insertOne()
		await new Factory()
		.consultantInfo(() => Promise.resolve(attachedRole))
		.startedAt(() => null)
		.insertOne()

		const canStart = await manager.canStart(model.id)

		expect(canStart).toBeTruthy()
	})

	it("cannot start because other consultation already starts", async() => {
		const manager = new Manager()
		const user = await new UserFactory().insertOne()
		const attachedRole = await new AttachedRoleFactory()
		.user(() => Promise.resolve(user))
		.insertOne()
		const model = await new Factory()
		.consultantInfo(() => Promise.resolve(attachedRole))
		.startedAt(() => null)
		.insertOne()
		await new Factory()
		.consultantInfo(() => Promise.resolve(attachedRole))
		.startedAt(() => new Date())
		.insertOne()

		const canStart = await manager.canStart(model.id)

		expect(canStart).toBeFalsy()
	})
})

describe("Database Manager: Consultation create operations", () => {
	it("can create resource", async() => {
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
						}
					]
				}
			},
			"type": "consultation"
		}
		const manager = new Manager()

		const createdData = await manager.createUsingResource(resource, user.id)

		expect(await Model.count()).toBe(1)
		expect(await ChatMessage.count()).toBe(1)
		expect(await ChatMessageActivity.count()).toBe(2)
		expect(createdData).toHaveProperty("data.attributes.actionTaken", model.actionTaken)
		expect(createdData).toHaveProperty("data.attributes.reason", model.reason)
		expect(createdData).toHaveProperty("data.relationships.consultant")
		expect(createdData).toHaveProperty("data.relationships.chatMessages")
		expect(createdData).toHaveProperty("data.relationships.consultantRole")
		expect(createdData).toHaveProperty("data.relationships.chatMessageActivities")
	})
})

describe("Database Manager: Miscellaneous chat message operations", () => {
	it("can get sortable columns", () => {
		// Include in test to alert in case there are new columns to decide whether to expose or not
		const manager = new Manager()

		const { sortableColumns } = manager

		expect(sortableColumns).toStrictEqual([
			"-actionTaken",
			"-createdAt",
			"-deletedAt",
			"-finishedAt",
			"-id",
			"-reason",
			"-scheduledStartAt",
			"-startedAt",
			"-updatedAt",
			"actionTaken",
			"createdAt",
			"deletedAt",
			"finishedAt",
			"id",
			"reason",
			"scheduledStartAt",
			"startedAt",
			"updatedAt"
		])
	})
})
