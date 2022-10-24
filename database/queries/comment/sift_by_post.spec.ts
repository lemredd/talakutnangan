import Model from "%/models/comment"
import Comment from "~/factories/comment"
import PostFactory from "~/factories/post"

import siftByPost from "./sift_by_post"

describe("Database Pipe: Sift by post", () => {
	it("can find on specific post", async() => {
		const post = await new PostFactory().insertOne()
		const model = await new Comment().post(() => Promise.resolve(post)).insertOne()

		const options = siftByPost({}, {
			"filter": {
				"postID": post.id
			}
		})
		const foundModels = await Model.findAll(options)

		expect(options).toHaveProperty("where")
		expect(foundModels).toHaveLength(1)
		expect(foundModels).toHaveProperty("0.id", model.id)
	})

	it("cannot find on empty post", async() => {
		const postA = await new PostFactory().insertOne()
		const postB = await new PostFactory().insertOne()
		await new Comment().post(() => Promise.resolve(postA)).insertOne()

		const options = siftByPost({}, {
			"filter": {
				"postID": postB.id
			}
		})
		const foundModels = await Model.findAll(options)

		expect(options).toHaveProperty("where")
		expect(foundModels).toHaveLength(0)
	})
})
