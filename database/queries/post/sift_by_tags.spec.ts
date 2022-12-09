import Model from "%/models/post"
import Factory from "~/factories/post"
import TagFactory from "~/factories/tag"
import PostTagFactory from "~/factories/post_tag"

import siftByTags from "./sift_by_tags"

describe("Database Pipe: Sift by tag", () => {
	it("can find on specific tag", async() => {
		const tag = await new TagFactory().insertOne()
		const model = await new Factory().insertOne()
		await new PostTagFactory()
		.post(() => Promise.resolve(model))
		.tag(() => Promise.resolve(tag))
		.insertOne()

		const options = siftByTags({}, {
			"filter": {
				"tagIDs": [ tag.id ]
			}
		})
		const foundModels = await Model.findAll(options)

		expect(options).toHaveProperty("include")
		expect(foundModels).toHaveLength(1)
		expect(foundModels).toHaveProperty("0.id", model.id)
	})

	it("cannot find on empty tag", async() => {
		const tagA = await new TagFactory().insertOne()
		const tagB = await new TagFactory().insertOne()
		const model = await new Factory().insertOne()
		await new PostTagFactory()
		.post(() => Promise.resolve(model))
		.tag(() => Promise.resolve(tagA))
		.insertOne()

		const options = siftByTags({}, {
			"filter": {
				"tagIDs": [ tagB.id ]
			}
		})
		const foundModels = await Model.findAll(options)

		expect(options).toHaveProperty("include")
		expect(foundModels).toHaveLength(0)
	})
})
