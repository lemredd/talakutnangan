import Model from "%/models/chat_message"
import Factory from "~/factories/chat_message"
import ChatMessageActivity from "%/models/chat_message_activity"
import ChatMessageActivityFactory from "~/factories/chat_message_activity"
import Manager from "./chat_message"

describe("Database Manager: Chat message create operations", () => {
	it("can create message", async() => {
		const chatMessageActivity = await new ChatMessageActivityFactory()
		.seenMessageAt(() => new Date())
		.insertOne()
		const model = await new Factory()
		.chatMessageActivity(() => Promise.resolve(chatMessageActivity))
		.makeOne()
		const manager = new Manager()

		await new Promise<void>(resolve => {
			const DELAY = 1000
			setTimeout(() => resolve(), DELAY);
		})
		const userData = await manager.create({
			"chatMessageActivityID": model.chatMessageActivityID,
			"data": model.data,
			"kind": model.kind
		})

		expect(await Model.count()).toBe(1)
		expect(await ChatMessageActivity.count()).toBe(1)
		expect(userData).toHaveProperty("data")
		expect(userData).toHaveProperty("data.attributes.kind", model.kind)
		expect(userData).toHaveProperty("data.attributes.data", model.data)
		expect(userData).toHaveProperty(
			"data.relationships.consultation.data.id",
			model.chatMessageActivity.consultationID
		)
		expect(userData).toHaveProperty("data.relationships.user")
		expect(userData).toHaveProperty("data.relationships.chatMessageActivity")
		const activity = await ChatMessageActivity.findByPk(
			model.chatMessageActivityID
		) as ChatMessageActivity
		expect(activity.seenMessageAt).toStrictEqual(chatMessageActivity.seenMessageAt)
		expect(activity.receivedMessageAt).not.toStrictEqual(chatMessageActivity.receivedMessageAt)
	})
})

describe("Database Manager: Miscellaneous chat message operations", () => {
	it("can get sortable columns", () => {
		// Include in test to alert in case there are new columns to decide whether to expose or not
		const manager = new Manager()

		const { sortableColumns } = manager

		expect(sortableColumns).toStrictEqual([
			"-createdAt",
			"-kind",
			"-updatedAt",
			"createdAt",
			"kind",
			"updatedAt"
		])
	})
})
