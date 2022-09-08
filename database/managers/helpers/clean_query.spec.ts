import cleanQuery from "./clean_query"

describe("Database: Clean query", () => {
	it("can clean query", () => {
		const dirtyQuery = `
			EXTRACT (
				WEEK FROM \`example\`
			)
		`

		const cleanedQuery = cleanQuery(dirtyQuery)

		expect(cleanedQuery).toEqual("EXTRACT (WEEK FROM `example`)")
	})
})
