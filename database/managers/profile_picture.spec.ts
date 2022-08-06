import UserFactory from "~/factories/user"
import ProfilePictureFactory from "~/factories/profile_picture"

import ProfilePictureManager from "./profile_picture"

describe("Database: Profile picture update operations", () => {
	it("can update profile picture", async () => {
		const manager = new ProfilePictureManager()
		const newProfilePicture = await new ProfilePictureFactory().makeOne()
		const user = await new UserFactory().insertOne()

		await new ProfilePictureFactory().user(async () => user).insertOne()

		const affectedCount= await manager.updateContents(user.id, newProfilePicture.file)

		expect(affectedCount).toBe(1)
	})
})
