import UserFactory from "~/factories/user"
import Factory from "~/factories/chat_message_activity"
import ConsultationFactory from "~/factories/consultation"
import Manager from "./chat_message_activity"

describe("Database Manager: Chat message activity read operations", () => {
	it("can read existing consultation IDs", async() => {
		const manager = new Manager()
		const user = await new UserFactory().insertOne()
		const consultation = await new ConsultationFactory().insertOne()
		const model = await new Factory()
		.user(() => Promise.resolve(user))
		.consultation(() => Promise.resolve(consultation))
		.insertOne()

		const consultationIDs = await manager.retrieveExistingConsultationIDs([ model.id ])

		expect(consultationIDs).toHaveProperty("0", consultation.id)
	})

	it("can find specific activity ID", async() => {
		const manager = new Manager()
		const user = await new UserFactory().insertOne()
		const consultation = await new ConsultationFactory().insertOne()
		const model = await new Factory()
		.user(() => Promise.resolve(user))
		.consultation(() => Promise.resolve(consultation))
		.insertOne()

		const chatMessageActivityID = await manager.findSessionID(user.id, consultation.id)

		expect(chatMessageActivityID).toBe(model.id)
	})
})

describe("Database Manager: Miscellaneous chat message activity operations", () => {
	it("can get sortable columns", () => {
		// Include in test to alert in case there are new columns to decide whether to expose or not
		const manager = new Manager()

		const { sortableColumns } = manager

		expect(sortableColumns).toStrictEqual([
			"-createdAt",
			"-id",
			"-receivedMessageAt",
			"-seenMessageAt",
			"-updatedAt",
			"createdAt",
			"id",
			"receivedMessageAt",
			"seenMessageAt",
			"updatedAt"
		])
	})
})
