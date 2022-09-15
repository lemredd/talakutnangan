import UserFactory from "~/factories/user"
import Model from "%/models/attached_chat_file"
import Factory from "~/factories/attached_chat_file"
import ChatMessageFactory from "~/factories/chat_message"
import ChatMessageActivity from "%/models/chat_message_activity"
import ChatMessageActivityFactory from "~/factories/chat_message_activity"
import Manager from "./attached_chat_file"

describe("Database Manager: Attached chat file read operations", () => {
	it("can check if model belongs to user", async() => {
		const manager = new Manager()
		const user = await new UserFactory().insertOne()
		const chatMessageActivity = await new ChatMessageActivityFactory()
		.user(() => Promise.resolve(user))
		.insertOne()
		const chatMessage = await new ChatMessageFactory()
		.chatMessageActivity(() => Promise.resolve(chatMessageActivity))
		.insertOne()
		const model = await new Factory().chatMessage(() => Promise.resolve(chatMessage)).insertOne()

		const doesBelong = await manager.isModelBelongsTo(model.id, user.id, manager.modelChainToUser)

		expect(doesBelong).toBeTruthy()
	})
})

describe("Database Manager: Miscellaneous attached chat file operations", () => {
	it("can get sortable columns", () => {
		// Include in test to alert in case there are new columns to decide whether to expose or not
		const manager = new Manager()

		const { sortableColumns } = manager

		expect(sortableColumns).toStrictEqual([
			"-createdAt",
			"-fileContents",
			"-updatedAt",
			"createdAt",
			"fileContents",
			"updatedAt"
		])
	})
})
