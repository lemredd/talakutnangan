import Model from "%/models/post"
import PostTag from "%/models/post_tag"
import Department from "%/models/department"
import PostAttachment from "%/models/post_attachment"

import Factory from "~/factories/post"
import TagFactory from "~/factories/tag"
import UserFactory from "~/factories/user"
import CommentFactory from "~/factories/comment"
import DepartmentFactory from "~/factories/department"
import AttachedRoleFactory from "~/factories/attached_role"
import PostAttachmentFactory from "~/factories/post_attachment"

import Manager from "./post"

describe("Database Manager: Post read operations", () => {
	it("can check if model belongs to user", async() => {
		const manager = new Manager()
		const user = await new UserFactory().insertOne()
		const attachedRole = new AttachedRoleFactory().user(() => Promise.resolve(user)).insertOne()
		const model = await new Factory().posterInfo(() => attachedRole).insertOne()

		const doesBelong = await manager.isModelBelongsTo(model.id, user.id, manager.modelChainToUser)

		expect(doesBelong).toBeTruthy()
	})

	it("can count comments", async() => {
		const manager = new Manager()
		const modelA = await new Factory().insertOne()
		const modelACommentCount = 3
		await new CommentFactory().post(() => Promise.resolve(modelA)).insertMany(modelACommentCount)
		const modelB = await new Factory().insertOne()
		const modelBCommentCount = 0
		await new CommentFactory().post(() => Promise.resolve(modelB)).insertMany(modelBCommentCount)

		const counts = await manager.countComments([ modelA.id, modelB.id ])

		expect(counts).toHaveProperty("data.0.id", String(modelA.id))
		expect(counts).toHaveProperty("data.0.meta.commentCount", modelACommentCount)
		expect(counts).toHaveProperty("data.1.id", String(modelB.id))
		expect(counts).toHaveProperty("data.1.meta.commentCount", modelBCommentCount)
	})
})
describe("Database Manager: Post create operations", () => {
	it("can create post", async() => {
		const department = await new DepartmentFactory().insertOne()
		const attachment = await new PostAttachmentFactory().insertOne()
		const tags = await new TagFactory().insertMany(3)
		const model = await new Factory().makeOne()
		const manager = new Manager()

		const data = await manager.createUsingResource({
			"attributes": {
				"content": model.content
			},
			"relationships": {
				"department": {
					"data": {
						"id": department.id
					}
				},
				"postAttachments": {
					"data": [
						{
							"id": attachment.id
						}
					]
				},
				"poster": {
					"data": {
						"id": model.poster?.id
					}
				},
				"posterRole": {
					"data": {
						"id": model.posterRole?.id
					}
				},
				"tags": {
					"data": tags.map(tag => ({
						"id": tag.id,
						"type": "tag"
					}))
				}
			}
		} as any)

		expect(await Model.count()).toBe(1)
		expect(await PostTag.count()).toBe(3)
		expect(await Department.count()).toBe(1)
		expect(await PostAttachment.count()).toBe(1)
		expect(data).toHaveProperty("data")
		expect(data).toHaveProperty("data.attributes.content", model.content)
	})

	it("can create post without tags", async() => {
		const department = await new DepartmentFactory().insertOne()
		const attachment = await new PostAttachmentFactory().insertOne()
		const model = await new Factory().makeOne()
		const manager = new Manager()

		const data = await manager.createUsingResource({
			"attributes": {
				"content": model.content
			},
			"relationships": {
				"department": {
					"data": {
						"id": department.id
					}
				},
				"postAttachments": {
					"data": [
						{
							"id": attachment.id
						}
					]
				},
				"poster": {
					"data": {
						"id": model.poster?.id
					}
				},
				"posterRole": {
					"data": {
						"id": model.posterRole?.id
					}
				}
			}
		} as any)

		expect(await Model.count()).toBe(1)
		expect(await PostTag.count()).toBe(0)
		expect(await Department.count()).toBe(1)
		expect(await PostAttachment.count()).toBe(1)
		expect(data).toHaveProperty("data")
		expect(data).toHaveProperty("data.attributes.content", model.content)
	})

	it("can create post without attachment and tags", async() => {
		const department = await new DepartmentFactory().insertOne()
		const model = await new Factory().makeOne()
		const manager = new Manager()

		const data = await manager.createUsingResource({
			"attributes": {
				"content": model.content
			},
			"relationships": {
				"department": {
					"data": {
						"id": department.id
					}
				},
				"postAttachments": {
					"data": []
				},
				"poster": {
					"data": {
						"id": model.poster?.id
					}
				},
				"posterRole": {
					"data": {
						"id": model.posterRole?.id
					}
				}
			}
		} as any)

		expect(await Model.count()).toBe(1)
		expect(await PostTag.count()).toBe(0)
		expect(await Department.count()).toBe(1)
		expect(await PostAttachment.count()).toBe(0)
		expect(data).toHaveProperty("data")
		expect(data).toHaveProperty("data.attributes.content", model.content)
	})

	it("can create post without attachment, tags and department", async() => {
		const model = await new Factory().makeOne()
		const manager = new Manager()

		const data = await manager.createUsingResource({
			"attributes": {
				"content": model.content
			},
			"relationships": {
				// eslint-disable-next-line no-undefined
				"department": undefined,
				"postAttachments": {
					"data": []
				},
				"poster": {
					"data": {
						"id": model.poster?.id
					}
				},
				"posterRole": {
					"data": {
						"id": model.posterRole?.id
					}
				}
			}
		} as any)

		expect(await Model.count()).toBe(1)
		expect(await PostTag.count()).toBe(0)
		expect(await Department.count()).toBe(0)
		expect(await PostAttachment.count()).toBe(0)
		expect(data).toHaveProperty("data")
		expect(data).toHaveProperty("data.attributes.content", model.content)
	})
})

describe("Database Manager: Miscellaneous post operations", () => {
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
