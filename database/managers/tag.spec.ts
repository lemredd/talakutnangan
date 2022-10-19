import Manager from "./tag"

describe("Database Manager: Miscellaneous semester operations", () => {
	it("can get sortable columns", () => {
		// Include in test to alert in case there are new columns to decide whether to expose or not
		const manager = new Manager()

		const { sortableColumns } = manager

		expect(sortableColumns).toStrictEqual([
			"-createdAt",
			"-deletedAt",
			"-id",
			"-name",
			"-updatedAt",
			"createdAt",
			"deletedAt",
			"id",
			"name",
			"updatedAt"
		])
	})
})