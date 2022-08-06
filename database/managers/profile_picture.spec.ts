import UserFactory from "~/factories/user"
import ProfilePictureFactory from "~/factories/profile_picture"

import ProfilePictureManager from "./profile_picture"

describe("Database: Profile picture update operations", () => {
	it("can create profile picture if not yet existing", async () => {
		const manager = new ProfilePictureManager()
		const profilePicture = await new ProfilePictureFactory().makeOne()
		const user = await new UserFactory().insertOne()

		const affectedCount= await manager.updateContents(user.id, profilePicture.file)

		expect(affectedCount).toBe(1)
	})
})
