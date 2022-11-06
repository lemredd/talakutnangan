import Model from "%/models/department"
import Factory from "~/factories/department"

import siftBySlug from "./sift_by_slug"

describe("Database Pipe: Sift by slug", () => {
	it("can find all", async() => {
		const model = await new Factory().insertOne()
		const slug = ""

		const options = siftBySlug({}, { "filter": { slug } })
		const foundModels = await Model.findAll(options)

		expect(options).not.toHaveProperty("include")
		expect(foundModels).toHaveLength(1)
		expect(foundModels).toHaveProperty("0.id", model.id)
	})

	it("can find on specific using fullName", async() => {
		const model = await new Factory()
		.fullName(() => "firstDepartment")
		.insertOne()
		await new Factory()
		.fullName(() => "secondDepartment")
		.insertOne()
		const slug = "fir"

		const options = siftBySlug({}, { "filter": { slug } })
		const foundModels = await Model.findAll(options)

		expect(options).toHaveProperty("where")
		expect(foundModels).toHaveLength(1)
		expect(foundModels).toHaveProperty("0.id", model.id)
	})

	it("cannot find on incorrect slug", async() => {
		await new Factory()
		.fullName(() => "firstDepartment")
		.insertOne()
		await new Factory()
		.fullName(() => "secondDepartment")
		.insertOne()
		const slug = "xx"

		const options = siftBySlug({}, { "filter": { slug } })
		const foundModels = await Model.findAll(options)

		expect(options).toHaveProperty("where")
		expect(foundModels).toHaveLength(0)
	})
})
