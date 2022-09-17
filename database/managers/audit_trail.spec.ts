import UserFactory from "~/factories/user"
import Factory from "~/factories/audit_trail"
import ProfilePictureFactory from "~/factories/profile_picture"

import Manager from "./audit_trail"

describe("Database Manager: Audit trail read operations", () => {
	it("can update profile picture", async() => {
		const manager = new Manager()
		const user = await new UserFactory().insertOne()
		const model = await new Factory().user(() => Promise.resolve(user)).insertOne()
		const profilePicture = await new ProfilePictureFactory()
		.user(() => Promise.resolve(user))
		.insertOne()
		model.user = user
		model.user.profilePicture = profilePicture

		const serializedModel = await manager.findWithID(model.id)

		expect(serializedModel).toHaveProperty("included.0.id", profilePicture.id)
		expect(serializedModel).toHaveProperty("included.1.id", user.id)
	})
})

describe("Database Manager: Miscellaneous operations", () => {
	it("can get sortable columns", () => {
		// Include in test to alert in case there are new columns to decide whether to expose or not
		const manager = new Manager()

		const { sortableColumns } = manager

		expect(sortableColumns).toStrictEqual([
			"-actionName",
			"-createdAt",
			"-deletedAt",
			"-id",
			"-updatedAt",
			"actionName",
			"createdAt",
			"deletedAt",
			"id",
			"updatedAt"
		])
	})
})
