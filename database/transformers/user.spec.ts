import type { GeneralObject } from "$/types/general"
import UserFactory from "~/factories/user"
import SignatureFactory from "~/factories/signature"
import StudentDetailFactory from "~/factories/student_detail"
import URLMaker from "$!/singletons/url_maker"
import Serializer from "%/transformers/serializer"
import Transformer from "./user"

describe("Transformer: User", () => {
	beforeEach(() => {
		URLMaker.initialize("http", "localhost", 16000, "/")
	})

	it("can transform into normal resource object", async () => {
		const model = await new UserFactory().beStudent().insertOne()
		const signature = await new SignatureFactory().user(() => Promise.resolve(model)).insertOne()
		const studentDetail = await new StudentDetailFactory()
			.user(() => Promise.resolve(model))
			.insertOne()
		model.password = studentDetail.studentNumber
		model.save()
		model.signature = signature
		model.studentDetail = studentDetail
		const transformer = new Transformer()

		const object = Serializer.serialize(model, transformer, {})
		expect(object).toHaveProperty("data.type", "user")
		expect(object).toHaveProperty("data.id", model.id)
		expect(object).toHaveProperty("meta.hasDefaultPassword", true)
		expect(object).toHaveProperty(
			"included.2.links.self",
			`http://localhost:16000/api/signature/read/${signature.id}`
		)
	})

	it("can transform into normal resource objects", async () => {
		const models = await new UserFactory().insertMany(2)
		const signatureA = await new SignatureFactory()
			.user(() => Promise.resolve(models[0]))
			.insertOne()
		const studentDetailA = await new StudentDetailFactory()
			.user(() => Promise.resolve(models[0]))
			.insertOne()
		models[0].signature = signatureA
		models[0].studentDetail = studentDetailA
		const signatureB = await new SignatureFactory()
			.user(() => Promise.resolve(models[1]))
			.insertOne()
		const studentDetailB = await new StudentDetailFactory()
			.user(() => Promise.resolve(models[1]))
			.insertOne()
		models[1].signature = signatureB
		models[1].studentDetail = studentDetailB
		const transformer = new Transformer()

		const object = Serializer.serialize(models, transformer, {})

		expect(object).toHaveProperty("data.0.type", "user")
		expect(object).toHaveProperty("data.0.id", models[0].id)
		expect(object).toHaveProperty("meta.hasDefaultPassword", null)
		expect(object).toHaveProperty(
			"included.2.links.self",
			`http://localhost:16000/api/signature/read/${signatureA.id}`
		)
		expect(object).toHaveProperty(
			"included.3.links.self",
			`http://localhost:16000/api/signature/read/${signatureB.id}`
		)
	})
})
