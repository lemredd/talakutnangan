import specializePath from "./specialize_path"

describe("Helper: Specialize path", () => {
	it("can bind ID", async () => {
		const id = 1
		const pathTemplate = "/api/user/update/:id"

		const specializedPath = specializePath(pathTemplate, { id })

		expect(specializedPath).toBe("/api/user/update/1")
	})

	it("can bind multiple IDs", async () => {
		const post_id = 2
		const id = 1
		const pathTemplate = "/api/post/:post_id/comment/:id"

		const specializedPath = specializePath(pathTemplate, {
			post_id,
			id
		})

		expect(specializedPath).toBe("/api/post/2/comment/1")
	})
})
