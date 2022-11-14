import Tag from "%/models/tag"
import TagFactory from "~/factories/tag"

import siftBySlug from "./sift_by_slug"

describe("Database Pipe: Sift by slug", () => {
	it("can find all", async() => {
		const tag = await new TagFactory().insertOne()
		const slug = ""

		const options = siftBySlug({}, { "filter": { slug } })
		const foundTags = await Tag.findAll(options)

		expect(options).not.toHaveProperty("include")
		expect(foundTags).toHaveLength(1)
		expect(foundTags).toHaveProperty("0.id", tag.id)
	})

	it("can find on specific using name", async() => {
		const tag = await new TagFactory()
		.name(() => "firsttag")
		.insertOne()
		await new TagFactory()
		.name(() => "secondtag")
		.insertOne()
		const slug = "fir"

		const options = siftBySlug({}, { "filter": { slug } })
		const foundTags = await Tag.findAll(options)

		expect(options).toHaveProperty("where")
		expect(foundTags).toHaveLength(1)
		expect(foundTags).toHaveProperty("0.id", tag.id)
	})

	it("cannot find on incorrect slug", async() => {
		await new TagFactory()
		.name(() => "firsttag")
		.insertOne()
		await new TagFactory()
		.name(() => "secondtag")
		.insertOne()
		const slug = "xx"

		const options = siftBySlug({}, { "filter": { slug } })
		const foundTags = await Tag.findAll(options)

		expect(options).toHaveProperty("where")
		expect(foundTags).toHaveLength(0)
	})
})
