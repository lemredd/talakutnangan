import AuditTrail from "%/models/audit_trail"
import UserFactory from "~/factories/user"
import Factory from "~/factories/audit_trail"
import ProfilePictureFactory from "~/factories/profile_picture"

import includeUser from "./include_user"

describe("Database Pipe: Include user", () => {
	it("can work properly with user having an existing profile picture", async () => {
		const user = await new UserFactory().insertOne()
		const model = await new Factory().user(async() => user).insertOne()
		const profilePicture = await new ProfilePictureFactory().user(async() => user).insertOne()
		model.user = user
		model.user.profilePicture = profilePicture

		const options = includeUser({}, { filter: { department: "*" } })
		const foundModels = await AuditTrail.findAll(options)

		expect(options).toHaveProperty("include")
		expect(foundModels).toHaveLength(1)
		expect(foundModels).toHaveProperty("0.id", model.id)
		expect(foundModels).toHaveProperty("0.user.id", user.id)
		expect(foundModels).toHaveProperty("0.user.profilePicture.id", profilePicture.id)
	})

	it("can work properly with user having no existing", async () => {
		const user = await new UserFactory().insertOne()
		const model = await new Factory().user(async() => user).insertOne()
		model.user = user

		const options = includeUser({}, { filter: { department: "*" } })
		const foundModels = await AuditTrail.findAll(options)

		expect(options).toHaveProperty("include")
		expect(foundModels).toHaveLength(1)
		expect(foundModels).toHaveProperty("0.id", model.id)
		expect(foundModels).toHaveProperty("0.user.id", user.id)
		expect(foundModels).toHaveProperty("0.user.profilePicture", null)
	})

	it("can work properly with no user", async () => {
		const model = await new Factory().user(async() => null).insertOne()

		const options = includeUser({}, { filter: { department: "*" } })
		const foundModels = await AuditTrail.findAll(options)

		expect(options).toHaveProperty("include")
		expect(foundModels).toHaveLength(1)
		expect(foundModels).toHaveProperty("0.id", model.id)
		expect(foundModels).toHaveProperty("0.user", null)
		expect(foundModels).not.toHaveProperty("0.user.profilePicture")
	})
})
