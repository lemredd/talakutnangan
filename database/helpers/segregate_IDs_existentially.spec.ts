import segregateIDsExistentially from "./segregate_IDs_existentially"

describe("Database: Segregate IDs existentially", () => {
	it("can determine new IDs", () => {
		const currentIDs = [ 1, 2 ]
		const previousIDs = [ 4 ]
		const modifiedIDs = [ 1, 2, 3 ]

		const segregatedIDs = segregateIDsExistentially(currentIDs, previousIDs, modifiedIDs)

		expect(segregatedIDs.newIDs).toEqual([ 3 ])
		expect(segregatedIDs.deletedIDs).toEqual([])
		expect(segregatedIDs.restoredIDs).toEqual([])
	})

	it("can determine deleted IDs", () => {
		const currentIDs = [ 1, 2 ]
		const previousIDs = [ 4 ]
		const modifiedIDs = [ 1 ]

		const segregatedIDs = segregateIDsExistentially(currentIDs, previousIDs, modifiedIDs)

		expect(segregatedIDs.newIDs).toEqual([])
		expect(segregatedIDs.deletedIDs).toEqual([ 2 ])
		expect(segregatedIDs.restoredIDs).toEqual([])
	})

	it("can determine new and deleted IDs", () => {
		const currentIDs = [ 1, 2 ]
		const previousIDs = [ 4 ]
		const modifiedIDs = [ 2, 3 ]

		const segregatedIDs = segregateIDsExistentially(currentIDs, previousIDs, modifiedIDs)

		expect(segregatedIDs.newIDs).toEqual([ 3 ])
		expect(segregatedIDs.deletedIDs).toEqual([ 1 ])
		expect(segregatedIDs.restoredIDs).toEqual([])
	})

	it("can determine restored IDs", () => {
		const currentIDs = [ 1, 2 ]
		const previousIDs = [ 4 ]
		const modifiedIDs = [ 1, 2, 4 ]

		const segregatedIDs = segregateIDsExistentially(currentIDs, previousIDs, modifiedIDs)

		expect(segregatedIDs.newIDs).toEqual([])
		expect(segregatedIDs.deletedIDs).toEqual([])
		expect(segregatedIDs.restoredIDs).toEqual([ 4 ])
	})

	it("can determine new and restored IDs", () => {
		const currentIDs = [ 1, 2 ]
		const previousIDs = [ 4 ]
		const modifiedIDs = [ 1, 2, 3, 4 ]

		const segregatedIDs = segregateIDsExistentially(currentIDs, previousIDs, modifiedIDs)

		expect(segregatedIDs.newIDs).toEqual([ 3 ])
		expect(segregatedIDs.deletedIDs).toEqual([])
		expect(segregatedIDs.restoredIDs).toEqual([ 4 ])
	})

	it("can determine deleted and restored IDs", () => {
		const currentIDs = [ 1, 2 ]
		const previousIDs = [ 4 ]
		const modifiedIDs = [ 1 ]

		const segregatedIDs = segregateIDsExistentially(currentIDs, previousIDs, modifiedIDs)

		expect(segregatedIDs.newIDs).toEqual([])
		expect(segregatedIDs.deletedIDs).toEqual([ 2 ])
		expect(segregatedIDs.restoredIDs).toEqual([ 4 ])
	})

	it("can determine new, deleted, and restored IDs", () => {
		const currentIDs = [ 1, 2 ]
		const previousIDs = [ 4 ]
		const modifiedIDs = [ 1, 3, 4 ]

		const segregatedIDs = segregateIDsExistentially(currentIDs, previousIDs, modifiedIDs)

		expect(segregatedIDs.newIDs).toEqual([ 3 ])
		expect(segregatedIDs.deletedIDs).toEqual([ 2 ])
		expect(segregatedIDs.restoredIDs).toEqual([ 4 ])
	})
})
