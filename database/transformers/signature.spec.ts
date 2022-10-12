import Factory from "~/factories/signature"
import URLMaker from "$!/singletons/url_maker"
import Serializer from "%/transformers/serializer"
import Transformer from "./signature"

describe("Transformer: Signature", () => {
	beforeEach(() => {
		URLMaker.initialize("http", "localhost", 16000, "/")
	})

	it("can transform into normal resource object", async() => {
		const model = await new Factory().insertOne()
		const transformer = new Transformer()

		const object = await Serializer.serialize(model, transformer, { "raw": true })

		expect(object).toHaveProperty("data.type", "signature")
		expect(object).toHaveProperty("data.id", String(model.id))
		expect(object).toHaveProperty("data.attributes.fileContents")
	})

	it("can transform into resource object with links", async() => {
		const model = await new Factory().insertOne()
		const transformer = new Transformer()

		const object = await Serializer.serialize(model, transformer, {})

		expect(object).toHaveProperty("data.type", "signature")
		expect(object).toHaveProperty("data.id", String(model.id))
		expect(object).toHaveProperty(
			"data.attributes.fileContents",
			`http://localhost:16000/api/signature/${model.id}`
		)
	})

	it("can transform into resource objects with links", async() => {
		const models = await new Factory().insertMany(3)
		const transformer = new Transformer()

		const object = await Serializer.serialize(models, transformer, {})

		expect(object).toHaveProperty("data.0.type", "signature")
		expect(object).toHaveProperty("data.0.id", String(models[0].id))
		expect(object).toHaveProperty(
			"data.0.attributes.fileContents",
			`http://localhost:16000/api/signature/${models[0].id}`
		)
		expect(object).toHaveProperty("data.1.type", "signature")
		expect(object).toHaveProperty("data.1.id", String(models[1].id))
		expect(object).toHaveProperty(
			"data.1.attributes.fileContents",
			`http://localhost:16000/api/signature/${models[1].id}`
		)
	})
})
