import Model from "%/models/consultation"
import UserFactory from "~/factories/user"
import Factory from "~/factories/consultation"
import ChatMessageActivityFactory from "~/factories/chat_message_activity"

import siftByUser from "./sift_by_user"

describe("Database Pipe: Sift by user", () => {
	it("can find on specific user", async() => {
		const user = await new UserFactory().beReachableEmployee().insertOne()
		const model = await new Factory().insertOne()
		const activity = await new ChatMessageActivityFactory()
		.user(() => Promise.resolve(user))
		.consultation(() => Promise.resolve(model))
		.insertOne()

		const options = siftByUser({}, {
			"filter": {
				"user": user.id
			}
		})
		const foundModels = await Model.findAll(options)

		expect(options).toHaveProperty("include.0.where.userID")
		expect(foundModels).toHaveLength(1)
		expect(foundModels).toHaveProperty("0.id", model.id)
		expect(foundModels).toHaveProperty("0.chatMessageActivities.0.id", activity.id)
	})

	it("cannot find on specific user", async() => {
		const user = await new UserFactory().beReachableEmployee().insertOne()
		const otherUser = await new UserFactory().beStudent().insertOne()
		const model = await new Factory().insertOne()
		await new ChatMessageActivityFactory()
		.user(() => Promise.resolve(user))
		.consultation(() => Promise.resolve(model))
		.insertOne()

		const options = siftByUser({}, {
			"filter": {
				"user": otherUser.id
			}
		})
		const foundModels = await Model.findAll(options)

		expect(options).toHaveProperty("include.0.where.userID")
		expect(foundModels).toHaveLength(0)
	})
})
