import Signature from "%/models/signature"
import UserFactory from "~/factories/user"
import SignatureFactory from "~/factories/signature"
import setUpDatabase from "~/set-ups/database.set_up"

import SignatureManager from "./signature"

describe("Database: Signature update operations", () => {
	setUpDatabase()

	it("can create signature if not yet existing", async () => {
		const manager = new SignatureManager()
		const signature = await new SignatureFactory().makeOne()
		const user = await new UserFactory().insertOne()

		const resource = await manager.attach(user.id, signature.signature)

		expect(resource).toHaveProperty("data.type", "signature")
		expect(resource).not.toHaveProperty("data.attributes.signature")
		expect(resource).toHaveProperty("data.links.self")
	})

	it("can create signature and delete the previous", async () => {
		const manager = new SignatureManager()
		const newSignature = await new SignatureFactory().makeOne()
		const user = await new UserFactory().insertOne()
		const oldSignature = await new SignatureFactory()
			.user(() => Promise.resolve(user))
			.insertOne()

		const resource = await manager.attach(user.id, newSignature.signature)

		expect(await Signature.findOne({
			where: { id: oldSignature.id }
		})).toBeNull()
		expect(resource).toHaveProperty("data.type", "signature")
		expect(resource).toHaveProperty("data.id")
		expect((resource as any).data.id).not.toEqual(oldSignature.id)
		expect(resource).not.toHaveProperty("data.attributes.signature")
		expect(resource).toHaveProperty("data.links.self")
	})
})
