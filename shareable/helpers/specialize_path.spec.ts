import specializePath from "./specialize_path"

describe("Helper: Specialize path", () => {
	it("can bind ID", () => {
		const id = 1
		const pathTemplate = "/api/user/:id"

		const specializedPath = specializePath(pathTemplate, { id })

		expect(specializedPath).toBe("/api/user/1")
	})

	it("can bind multiple IDs", () => {
		const postID = 2
		const id = 1
		const pathTemplate = "/api/post/:postID/comment/:id"

		const specializedPath = specializePath(pathTemplate, {
			id,
			postID
		})

		expect(specializedPath).toBe("/api/post/2/comment/1")
	})
})
