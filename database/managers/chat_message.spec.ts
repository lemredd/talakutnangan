import Model from "%/models/chat_message"
import Factory from "~/factories/chat_message"
import ConsultationFactory from "~/factories/consultation"
import ChatMessageActivity from "%/models/chat_message_activity"
import ChatMessageActivityFactory from "~/factories/chat_message_activity"
import Manager from "./chat_message"

describe("Database Manager: Chat message read operations", () => {
	it("can read preview messages", async() => {
		const consultations = await new ConsultationFactory().insertMany(2)
		const chatMessageActivityA = await new ChatMessageActivityFactory()
		.consultation(() => Promise.resolve(consultations[0]))
		.insertOne()
		const modelA = await new Factory()
		.chatMessageActivity(() => Promise.resolve(chatMessageActivityA))
		.insertOne()
		const chatMessageActivityB = await new ChatMessageActivityFactory()
		.consultation(() => Promise.resolve(consultations[1]))
		.insertOne()
		const modelB = await new Factory()
		.chatMessageActivity(() => Promise.resolve(chatMessageActivityB))
		.insertOne()
		await new Promise<void>(resolve => {
			const DELAY = 1000
			setTimeout(() => resolve(), DELAY)
		})
		const modelC = await new Factory()
		.chatMessageActivity(() => Promise.resolve(chatMessageActivityA))
		.insertOne()
		const modelD = await new Factory()
		.chatMessageActivity(() => Promise.resolve(chatMessageActivityB))
		.insertOne()
		const manager = new Manager()


		const consultationIDs = consultations.map(consultation => consultation.id)
		const models = await manager.findPreviews(consultationIDs)

		expect(models).not.toHaveProperty("data.0.id", String(modelA.id))
		expect(models).toHaveProperty("data.0.id", String(modelC.id))
		expect(models).not.toHaveProperty("data.1.id", String(modelB.id))
		expect(models).toHaveProperty("data.1.id", String(modelD.id))
		expect(models).not.toHaveProperty("data.2")
		expect(models).toHaveProperty("meta.count", 2)
	})
})

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
			setTimeout(() => resolve(), DELAY)
		})
		const data = await manager.create({
			"chatMessageActivityID": model.chatMessageActivityID,
			"data": model.data,
			"kind": model.kind
		})

		expect(await Model.count()).toBe(1)
		expect(await ChatMessageActivity.count()).toBe(1)
		expect(data).toHaveProperty("data")
		expect(data).toHaveProperty("data.attributes.kind", model.kind)
		expect(data).toHaveProperty("data.attributes.data", model.data)
		expect(data).toHaveProperty(
			"data.relationships.consultation.data.id",
			model.chatMessageActivity?.consultationID
		)
		expect(data).toHaveProperty("data.relationships.user")
		expect(data).toHaveProperty("data.relationships.chatMessageActivity")
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
