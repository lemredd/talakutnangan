import Model from "%/models/chat_message"
import Factory from "~/factories/chat_message"
import ChatMessageActivity from "%/models/chat_message_activity"
import ChatMessageActivityFactory from "~/factories/chat_message_activity"
import Manager from "./chat_message"

describe("Database Manager: Chat message create operations", () => {
	it("can create message", async() => {
		const chatMessageActivity = await new ChatMessageActivityFactory().insertOne()
		const model = await new Factory()
		.chatMessageActivity(() => Promise.resolve(chatMessageActivity))
		.makeOne()
		const manager = new Manager()

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
		const activity = await ChatMessageActivity.findByPk(
			model.chatMessageActivityID
		) as ChatMessageActivity
		expect(activity).not.toBeNull()
		expect(activity.seenMessageAt).not.toBe(chatMessageActivity.seenMessageAt)
		expect(activity.receivedMessageAt).not.toBe(chatMessageActivity.receivedMessageAt)
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
