import Role from "%/models/role"
import RoleFactory from "~/factories/role"
import DepartmentPermissions from "$/permissions/department_permissions"

import RoleManager from "./role"

describe("Database: Role read operations", () => {
	it("can search role with matching query", async () => {
		const manager = new RoleManager()
		const role = await (new RoleFactory()).insertOne()
		const incompleteName = role.name.slice(1)

		const { records, count } = await manager.list({
			name: incompleteName,
			page: 0,
			limit: 1
		})

		expect(count).toBe(1)
		expect(records[0].name).toBe(role.name)
	})

	it("cannot search role with non-matching query", async () => {
		const manager = new RoleManager()
		const role = await (new RoleFactory()).insertOne()
		const incorrectName = role.name + "1"

		const { records, count } = await manager.list({
			name: incorrectName,
			page: 0,
			limit: 1
	})

		expect(count).toBe(0)
		expect(records).toHaveLength(0)
	})
})

describe("Database: Role create operations", () => {
	it("can create role", async () => {
		const permissions = new DepartmentPermissions()
		const flags = permissions.generateMask("view")
		const manager = new RoleManager()
		const role = await (new RoleFactory()).departmentFlags(flags).makeOne()

		const createdRole = await manager.create(role.toJSON())

		expect(createdRole.departmentFlags).toStrictEqual(role.departmentFlags)
	})
})

describe("Database: Role update operations", () => {
	it("can update role", async () => {
		const permissions = new DepartmentPermissions()
		const oldFlags = permissions.generateMask("view", "create")
		const newFlags = permissions.generateMask("view", "update", "archiveAndRestore")
		const manager = new RoleManager()
		const role = await (new RoleFactory()).departmentFlags(oldFlags).insertOne()

		const updateCount = await manager.update(role.id, {
			...role.toJSON(),
			departmentFlags: newFlags
		})

		expect(updateCount).toBe(1)
		const updatedRole = await Role.findOne({
			where: { id: role.id }
		})
		expect(updatedRole!.departmentFlags).not.toBe(oldFlags)
		expect(updatedRole!.departmentFlags).toBe(newFlags)
	})
})

describe("Database: Role archive and restore operations", () => {
	it("archive role", async () => {
		const manager = new RoleManager()
		const role = await (new RoleFactory()).insertOne()

		const deleteCount = await manager.archive(role.id)

		expect(deleteCount).toBe(1)
		expect((
			await Role.findOne({
				where: { id: role.id },
				paranoid: true
			})
		)?.deletedAt).not.toBeNull()
	})

	it("restore role", async () => {
		const manager = new RoleManager()
		const role = await (new RoleFactory()).insertOne()
		await role.destroy({force: false})

		await manager.restore(role.id)

		expect((
			await Role.findOne({
				where: { id: role.id }
			})
		)!.deletedAt).toBeNull()
	})
})
