import Factory from "~/factories/post"
import UserFactory from "~/factories/user"
import CommentFactory from "~/factories/comment"
import AttachedRoleFactory from "~/factories/attached_role"

import Manager from "./post"

describe("Database Manager: Post read operations", () => {
	it("can check if model belongs to user", async() => {
		const manager = new Manager()
		const user = await new UserFactory().insertOne()
		const attachedRole = new AttachedRoleFactory().user(() => Promise.resolve(user)).insertOne()
		const model = await new Factory().posterInfo(() => attachedRole).insertOne()

		const doesBelong = await manager.isModelBelongsTo(model.id, user.id, manager.modelChainToUser)

		expect(doesBelong).toBeTruthy()
	})

	it("can count comments", async() => {
		const manager = new Manager()
		const modelA = await new Factory().insertOne()
		const modelACommentCount = 3
		await new CommentFactory().post(() => Promise.resolve(modelA)).insertMany(modelACommentCount)
		const modelB = await new Factory().insertOne()
		const modelBCommentCount = 0
		await new CommentFactory().post(() => Promise.resolve(modelB)).insertMany(modelBCommentCount)

		const counts = await manager.countComments([ modelA.id, modelB.id ])

		expect(counts).toHaveProperty("data.0.id", String(modelA.id))
		expect(counts).toHaveProperty("data.0.meta.commentCount", modelACommentCount)
		expect(counts).toHaveProperty("data.1.id", String(modelB.id))
		expect(counts).toHaveProperty("data.1.meta.commentCount", modelBCommentCount)
	})
})

describe("Database Manager: Miscellaneous post operations", () => {
	it("can get sortable columns", () => {
		// Include in test to alert in case there are new columns to decide whether to expose or not
		const manager = new Manager()

		const { sortableColumns } = manager

		expect(sortableColumns).toStrictEqual([
			"-content",
			"-createdAt",
			"-id",
			"-updatedAt",
			"content",
			"createdAt",
			"id",
			"updatedAt"
		])
	})
})
