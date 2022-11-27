import type { AuthenticatedRequest } from "!/types/dependent"
import type { ValidationConstraints } from "!/types/validation"

import "~/setups/database.setup"
import Factory from "~/factories/tag"
import PostFactory from "~/factories/post"
import PostTagFactory from "~/factories/post_tag"

import makeInitialState from "!/validators/make_initial_state"

import validator from "./has_no_other_posts"

describe("Validator: has no other posts", () => {
	it("can accept valid input", async() => {
		await new PostFactory().insertOne()
		const model = await new Factory().insertOne()
		const value = Promise.resolve(makeInitialState(model.id))
		const constraints = {
			"field": "hello",
			"request": {} as AuthenticatedRequest,
			"source": {}
		} as unknown as ValidationConstraints<AuthenticatedRequest>

		const sanitizeValue = (await validator(value, constraints)).value

		expect(sanitizeValue).toEqual(model.id)
	})

	it("cannot accept invalid value", async() => {
		const postFactory = new PostFactory()
		const postTagFactory = new PostTagFactory()
		const post = await postFactory.insertOne()
		const model = await new Factory().insertOne()
		await postTagFactory
		.post(() => Promise.resolve(post))
		.tag(() => Promise.resolve(model))
		.insertOne()
		const value = Promise.resolve(makeInitialState(model.id))
		const constraints = {
			"field": "hello",
			"request": {} as AuthenticatedRequest,
			"source": {}
		} as unknown as ValidationConstraints<AuthenticatedRequest>

		try {
			await validator(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})
})
