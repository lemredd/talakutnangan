import URLMaker from "$!/singletons/url_maker"
import Factory from "~/factories/profile_picture"
import Serializer from "%/transformers/serializer"
import Transformer from "./profile_picture"

describe("Transformer: Profile picture", () => {
	beforeEach(() => {
		URLMaker.initialize("http", "localhost", 16000, "/")
	})

	it("can transform into normal resource object", async () => {
		const model = await new Factory().insertOne()
		const transformer = new Transformer()

		const object = Serializer.serialize(model, transformer, { raw: true })

		expect(object).toHaveProperty("data.type", "profile_picture")
		expect(object).toHaveProperty("data.id", model.id)
		expect(object).toHaveProperty("data.attributes.fileContents")
		expect(object).not.toHaveProperty("data.links.self")
	})

	it("can transform into resource object with links", async () => {
		const model = await new Factory().insertOne()
		const transformer = new Transformer()

		const object = Serializer.serialize(model, transformer, {})

		expect(object).toHaveProperty("data.type", "profile_picture")
		expect(object).toHaveProperty("data.id", model.id)
		expect(object).toHaveProperty(
			"data.links.self",
			"http://localhost:16000/api/profile_picture/"+model.id
		)
	})

	it("can transform into resource objects with links", async () => {
		const models = await new Factory().insertMany(3)
		const transformer = new Transformer()

		const object = Serializer.serialize(models, transformer, {})

		expect(object).toHaveProperty("data.0.type", "profile_picture")
		expect(object).toHaveProperty("data.0.id", models[0].id)
		expect(object).toHaveProperty(
			"data.0.links.self",
			"http://localhost:16000/api/profile_picture/"+models[0].id
		)
		expect(object).toHaveProperty("data.1.type", "profile_picture")
		expect(object).toHaveProperty("data.1.id", models[1].id)
		expect(object).toHaveProperty(
			"data.1.links.self",
			"http://localhost:16000/api/profile_picture/"+models[1].id
		)
	})
})