import type { GeneralObject } from "$/types/server"
import UserFactory from "~/factories/user"
import SignatureFactory from "~/factories/signature"
import URLMaker from "$!/singletons/url_maker"
import Serializer from "%/transformers/serializer"
import Transformer from "./user"

describe("Transformer: User", () => {
	beforeEach(() => {
		URLMaker.initialize("http", "localhost", 16000, "/")
	})

	it("can transform into normal resource object", async () => {
		const model = await new UserFactory().insertOne()
		const signature = await new SignatureFactory().user(() => Promise.resolve(model)).insertOne()
		model.signature = signature
		const transformer = new Transformer()

		const object = Serializer.serialize(model, transformer, {})

		expect(object).toHaveProperty("data.type", "user")
		expect(object).toHaveProperty("data.id", model.id)
		expect(object).toHaveProperty(
			"included.0.links.self",
			`http://localhost:16000/api/signature/${signature.id}`
		)
	})

	it("can transform into normal resource objects", async () => {
		const models = await new UserFactory().insertMany(2)
		const signatureA = await new SignatureFactory()
			.user(() => Promise.resolve(models[0]))
			.insertOne()
		models[0].signature = signatureA
		const signatureB = await new SignatureFactory()
			.user(() => Promise.resolve(models[1]))
			.insertOne()
		models[1].signature = signatureB
		const transformer = new Transformer()

		const object = Serializer.serialize(models, transformer, {})

		expect(object).toHaveProperty("data.0.type", "user")
		expect(object).toHaveProperty("data.0.id", models[0].id)
		expect(object).toHaveProperty(
			"included.0.links.self",
			`http://localhost:16000/api/signature/${signatureA.id}`
		)
		expect(object).toHaveProperty(
			"included.1.links.self",
			`http://localhost:16000/api/signature/${signatureB.id}`
		)
	})
})
