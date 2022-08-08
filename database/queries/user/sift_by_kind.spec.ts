import User from "%/models/user"
import UserFactory from "~/factories/user"
import setUpDatabase from "~/set-ups/database.set_up"

import siftByKind from "./sift_by_kind"

describe("Database Query Pipe: Sift by kind", () => {
	setUpDatabase()

	it("can find all", async () => {
		const student = await new UserFactory().beStudent().insertOne()
		const reachableEmployee = await new UserFactory().beReachableEmployee().insertOne()
		const unreachableEmployee = await new UserFactory().beUnreachableEmployee().insertOne()

		const options = siftByKind({}, { filter: { kind: "*" } })
		const foundUsers = await User.findAll(options)

		expect(options).not.toHaveProperty("where.kind")
		expect(foundUsers).toHaveLength(3)
		expect(foundUsers).toHaveProperty("0.id", student.id)
		expect(foundUsers).toHaveProperty("1.id", reachableEmployee.id)
		expect(foundUsers).toHaveProperty("2.id", unreachableEmployee.id)
	})

	it("can find on specific kind", async () => {
		const student = await new UserFactory().beStudent().insertOne()
		const reachableEmployee = await new UserFactory().beReachableEmployee().insertOne()
		const unreachableEmployee = await new UserFactory().beUnreachableEmployee().insertOne()

		const options = siftByKind({}, { filter: { kind: "reachable_employee" } })
		const foundUsers = await User.findAll(options)

		expect(options).toHaveProperty("where.kind")
		expect(foundUsers).toHaveLength(1)
		expect(foundUsers).toHaveProperty("0.id", reachableEmployee.id)
	})

	it("cannot find on empty kind", async () => {
		const student = await new UserFactory().beStudent().insertOne()
		const reachableEmployee = await new UserFactory().beReachableEmployee().insertOne()

		const options = siftByKind({}, { filter: { kind: "unreachable_employee" } })
		const foundUsers = await User.findAll(options)

		expect(options).toHaveProperty("where.kind")
		expect(foundUsers).toHaveLength(0)
	})
})
