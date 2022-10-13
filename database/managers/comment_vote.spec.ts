import Manager from "./comment_vote"

describe("Database Manager: Miscellaneous comment vote operations", () => {
	it("can get sortable columns", () => {
		// Include in test to alert in case there are new columns to decide whether to expose or not
		const manager = new Manager()

		const { sortableColumns } = manager

		expect(sortableColumns).toStrictEqual([
			"-createdAt",
			"-deletedAt",
			"-id",
			"-kind",
			"-updatedAt",
			"createdAt",
			"deletedAt",
			"id",
			"kind",
			"updatedAt"
		])
	})
})
