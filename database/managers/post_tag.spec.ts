import Factory from "~/factories/post_tag"
import Manager from "./post_tag"

describe("Database Manager: Post tag read operations", () => {
	it("can check if model belongs to post", async() => {
		const manager = new Manager()
		const model = await new Factory().insertOne()

		const foundModel = await manager.findPostTag(model.postID, model.tagID)

		expect(foundModel).not.toBeNull()
		expect(foundModel).toHaveProperty("id", model.id)
	})
})

describe("Database Manager: Miscellaneous post tag operations", () => {
	it("can get sortable columns", () => {
		// Include in test to alert in case there are new columns to decide whether to expose or not
		const manager = new Manager()

		const { sortableColumns } = manager

		expect(sortableColumns).toStrictEqual([])
	})
})
