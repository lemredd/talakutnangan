import Factory from "~/factories/tag"
import PostTag from "%/models/post_tag"
import PostFactory from "~/factories/post"

import Condition from "%/helpers/condition"

import Manager from "./tag"

describe("Database Manager: Tag update operations", () => {
	it("can reattach tags", async() => {
		const tags = await new Factory().insertMany(4)
		const manager = new Manager()
		const post = await new PostFactory().insertOne()
		await PostTag.bulkCreate([
			tags[0].id,
			tags[1].id,
			tags[2].id
		].map(id => ({
			"postID": post.id,
			"tagID": id
		})))

		await manager.reattach(post.id, [
			tags[1].id,
			tags[2].id,
			tags[3].id
		])

		const postTags = await PostTag.findAll({
			"where": new Condition().equal("postID", post.id).build()
		})
		expect(postTags).toHaveLength(3)
		expect(postTags).toHaveProperty("0.tagID", tags[1].id)
		expect(postTags).toHaveProperty("1.tagID", tags[2].id)
		expect(postTags).toHaveProperty("2.tagID", tags[3].id)
	})
})

describe("Database Manager: Miscellaneous tag operations", () => {
	it("can get sortable columns", () => {
		// Include in test to alert in case there are new columns to decide whether to expose or not
		const manager = new Manager()

		const { sortableColumns } = manager

		expect(sortableColumns).toStrictEqual([
			"-createdAt",
			"-deletedAt",
			"-id",
			"-name",
			"-updatedAt",
			"createdAt",
			"deletedAt",
			"id",
			"name",
			"updatedAt"
		])
	})
})
