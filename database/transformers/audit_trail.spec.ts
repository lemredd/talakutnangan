import UserFactory from "~/factories/user"
import Factory from "~/factories/audit_trail"
import Serializer from "%/transformers/serializer"
import ProfilePictureFactory from "~/factories/profile_picture"
import Transformer from "./audit_trail"

describe("Transformer: Audit trail", () => {
	it("can transform into normal resource object", async() => {
		const model = await new Factory().insertOne()
		const user = await new UserFactory().insertOne()
		const profilePicture = await new ProfilePictureFactory()
		.user(() => Promise.resolve(user))
		.insertOne()
		model.user = user
		model.user.profilePicture = profilePicture
		const transformer = new Transformer()

		const object = await Serializer.serialize(model, transformer)

		expect(object).toHaveProperty("data.type", "audit_trail")
		expect(object).toHaveProperty("data.id", String(model.id))
		expect(object).toHaveProperty("data.attributes.actionName", model.actionName)
		expect(object).toHaveProperty("data.attributes.extra", {})
		expect(object).toHaveProperty("included.0.type", "department")
		expect(object).toHaveProperty("included.1.type", "profile_picture")
		expect(object).toHaveProperty("included.2.type", "user")
		expect(object).not.toHaveProperty("included.3")
	})
})
