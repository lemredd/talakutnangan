import Factory from "~/factories/found_post_word"
import Manager from "./found_post_word"

describe("Database Manager: Post profanity filter read operations", () => {
	it("can check if model belongs to post", async() => {
		const manager = new Manager()
		const model = await new Factory().insertOne()

		const foundModel = await manager.findFoundPostWord(model.postID, model.profanityFilterID)

		expect(foundModel).not.toBeNull()
		expect(foundModel).toHaveProperty("id", model.id)
	})
})

describe("Database Manager: Miscellaneous post profanity filter operations", () => {
	it("can get sortable columns", () => {
		// Include in test to alert in case there are new columns to decide whether to expose or not
		const manager = new Manager()

		const { sortableColumns } = manager

		expect(sortableColumns).toStrictEqual([])
	})
})
