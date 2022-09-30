import Factory from "~/factories/post"
import UserFactory from "~/factories/user"
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
})

describe("Database Manager: Miscellaneous post operations", () => {
	it("can get sortable columns", () => {
		// Include in test to alert in case there are new columns to decide whether to expose or not
		const manager = new Manager()

		const { sortableColumns } = manager

		expect(sortableColumns).toStrictEqual([
			"-createdAt",
			"-content",
			"-id",
			"-updatedAt",
			"createdAt",
			"content",
			"id",
			"updatedAt"
		])
	})
})
