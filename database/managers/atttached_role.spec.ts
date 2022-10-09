import Factory from "~/factories/attached_role"
import Manager from "./attached_role"

describe("Database Manager: Attached role read operations", () => {
	it("can check if model belongs to user", async() => {
		const manager = new Manager()
		const model = await new Factory().insertOne()

		const foundModel = await manager.findAttachedRole(model.userID, model.roleID)

		expect(foundModel).not.toBeNull()
		expect(foundModel).toHaveProperty("id", model.id)
	})
})

describe("Database Manager: Miscellaneous attached role operations", () => {
	it("can get sortable columns", () => {
		// Include in test to alert in case there are new columns to decide whether to expose or not
		const manager = new Manager()

		const { sortableColumns } = manager

		expect(sortableColumns).toStrictEqual([])
	})
})
