import segregateIDs from "./segragate_IDs"

describe("Database: Condition Builder", () => {
	it("can determine new IDs", () => {
		const originalIDs = [ 1, 2 ]
		const modifiedIDs = [ 1, 2, 3 ]

		const segregatedIDs = segregateIDs(originalIDs, modifiedIDs)

		expect(segregatedIDs.newIDs).toEqual([ 3 ])
		expect(segregatedIDs.deletedIDs).toEqual([])
	})

	it("can determine deleted IDs", () => {
		const originalIDs = [ 1, 2 ]
		const modifiedIDs = [ 1 ]

		const segregatedIDs = segregateIDs(originalIDs, modifiedIDs)

		expect(segregatedIDs.newIDs).toEqual([])
		expect(segregatedIDs.deletedIDs).toEqual([ 2 ])
	})

	it("can determine new and deleted IDs", () => {
		const originalIDs = [ 1, 2 ]
		const modifiedIDs = [ 2, 3 ]

		const segregatedIDs = segregateIDs(originalIDs, modifiedIDs)

		expect(segregatedIDs.newIDs).toEqual([ 3 ])
		expect(segregatedIDs.deletedIDs).toEqual([ 1 ])
	})
})
