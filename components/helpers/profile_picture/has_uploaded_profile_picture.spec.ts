import typeGuard from "./has_uploaded_profile_picture"

describe("Type Guard: profile picture", () => {
	it("Should check if profile picture has file contents", () => {
		const profilePicture = {
			"data": {
				"fileContents": "sample/url.png"
			}
		}

		expect(typeGuard(profilePicture)).toBeTruthy()
	})
})
