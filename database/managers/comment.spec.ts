import type { CommentIdentifierListDocumentWithVotes } from "$/types/documents/comment"

import Factory from "~/factories/comment"
import UserFactory from "~/factories/user"
import CommentVoteFactory from "~/factories/comment_vote"

import Manager from "./comment"

describe("Database Manager: Comment read operations", () => {
	it("can read number of votes without self", async() => {
		const manager = new Manager()
		const user = await new UserFactory().insertOne()
		const model = await new Factory().insertOne()
		const upvoteCount = 4
		const downvoteCount = 5
		const commentVoteFactory = new CommentVoteFactory()
		await commentVoteFactory
		.kind(() => "upvote")
		.comment(() => Promise.resolve(model))
		.insertMany(upvoteCount)
		await commentVoteFactory
		.kind(() => "downvote")
		.comment(() => Promise.resolve(model))
		.insertMany(downvoteCount)

		const document = await manager.countVotes(user.id, [
			model.id
		]) as CommentIdentifierListDocumentWithVotes

		expect(document).toHaveProperty("data.0.meta.upvoteCount", upvoteCount)
		expect(document).toHaveProperty("data.0.meta.downvoteCount", downvoteCount)
		expect(document).toHaveProperty("data.0.meta.currentUserVoteStatus", "abstain")
		expect(document).toHaveProperty("data.0.meta.commentVoteID", null)
	})

	it("can read number of votes with self", async() => {
		const manager = new Manager()
		const user = await new UserFactory().insertOne()
		const model = await new Factory().insertOne()
		const upvoteCount = 4
		const downvoteCount = 2
		const commentVoteFactory = new CommentVoteFactory()
		await commentVoteFactory
		.kind(() => "upvote")
		.comment(() => Promise.resolve(model))
		.insertMany(upvoteCount)
		await commentVoteFactory
		.kind(() => "downvote")
		.comment(() => Promise.resolve(model))
		.insertMany(downvoteCount)
		const downvote = await commentVoteFactory
		.kind(() => "downvote")
		.user(() => Promise.resolve(user))
		.comment(() => Promise.resolve(model))
		.insertOne()

		const document = await manager.countVotes(user.id, [
			model.id
		]) as CommentIdentifierListDocumentWithVotes

		expect(document).toHaveProperty("data.0.meta.upvoteCount", upvoteCount)
		expect(document).toHaveProperty("data.0.meta.downvoteCount", downvoteCount + 1)
		expect(document).toHaveProperty("data.0.meta.currentUserVoteStatus", "downvote")
		expect(document).toHaveProperty("data.0.meta.commentVoteID", String(downvote.id))
	})
})

describe("Database Manager: Miscellaneous comment operations", () => {
	it("can get sortable columns", () => {
		// Include in test to alert in case there are new columns to decide whether to expose or not
		const manager = new Manager()

		const { sortableColumns } = manager

		expect(sortableColumns).toStrictEqual([
			"-content",
			"-createdAt",
			"-id",
			"-updatedAt",
			"content",
			"createdAt",
			"id",
			"updatedAt"
		])
	})
})
