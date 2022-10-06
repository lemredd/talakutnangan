import Manager from "./comment"

describe("Database Manager: Miscellaneous comment operations", () => {
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
