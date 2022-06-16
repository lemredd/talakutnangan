import type { PermissionMap, PermissionInfo } from "$/types/server"

import BasePermissionGroup from "./base"

describe("Back-end: Base Permission Group", () => {
	type GroupNameA = { "groupA": number }
	type AvailablePermissionsA = "a" | "b"

	class GroupA extends BasePermissionGroup<GroupNameA, AvailablePermissionsA> {
		get name(): string { return "groupA" }
		get permissions(): PermissionMap<AvailablePermissionsA> {
			return new Map<AvailablePermissionsA, PermissionInfo<AvailablePermissionsA>>([
				[ "a", { flag: 0x1, permissionDependencies: [] } ],
				[ "b", { flag: 0x2, permissionDependencies: [] } ]
			])
		}
	}

	it("can allow using simple permission", async () => {
		const permissionGroup = new GroupA()

		const isAllowed = permissionGroup.mayAllow({ "groupA": 0x1 }, "a")

		expect(isAllowed).toBeTruthy()
		expect(permissionGroup.mayAllow({ "groupA": 0x1 }, "b")).toBeFalsy()
	})

	it("can deny using simple permission", async () => {
		const permissionGroup = new GroupA()

		const isAllowed = permissionGroup.mayAllow({ "groupA": 0x1 }, "b")

		expect(isAllowed).toBeFalsy()
	})

	type GroupNameB = { "groupB": number }
	type AvailablePermissionsB = "c" | "d"

	class GroupB extends BasePermissionGroup<GroupNameB, AvailablePermissionsB> {
		get name(): string { return "groupB" }
		get permissions(): PermissionMap<AvailablePermissionsB> {
			return new Map<AvailablePermissionsB, PermissionInfo<AvailablePermissionsB>>([
				[ "c", { flag: 0x1, permissionDependencies: [] } ],
				[ "d", { flag: 0x2, permissionDependencies: [ "c" ] } ]
			])
		}
	}

	it("can allow using dependent permission", async () => {
		const permissionGroup = new GroupB()

		const isAllowed = permissionGroup.mayAllow({ "groupB": 0x3 }, "d")
		expect(isAllowed).toBeTruthy()
	})

	it("can deny using dependent permission because itself is not allowed", async () => {
		const permissionGroup = new GroupB()

		const isAllowed = permissionGroup.mayAllow({ "groupB": 0x2 }, "d")

		expect(isAllowed).toBeFalsy()
	})

	it("can deny using dependent permission because dependency does not allow", async () => {
		const permissionGroup = new GroupB()

		const isAllowed = permissionGroup.mayAllow({ "groupB": 0x1 }, "d")

		expect(isAllowed).toBeFalsy()
	})

	it("can generate mask of simple permission", async () => {
		const permissionGroup = new GroupB()

		const mask = permissionGroup.generateMask("c")

		expect(mask).toBe(0x1)
	})

	it("can generate mask of dependent permission", async () => {
		const permissionGroup = new GroupB()

		const mask = permissionGroup.generateMask("d")

		expect(mask).toBe(0x3)
	})

	type GroupNameC = { "groupC": number }
	type AvailablePermissionsC = "e" | "f" | "g"

	class GroupC extends BasePermissionGroup<GroupNameC, AvailablePermissionsC> {
		get name(): string { return "groupC" }
		get permissions(): PermissionMap<AvailablePermissionsC> {
			return new Map<AvailablePermissionsC, PermissionInfo<AvailablePermissionsC>>([
				[ "e", { flag: 0x1, permissionDependencies: [] } ],
				[ "f", { flag: 0x2, permissionDependencies: [] } ],
				[ "g", { flag: 0x4, permissionDependencies: [] } ]
			])
		}
	}

	it("can allow using multiple independent permissions", async () => {
		const permissionGroup = new GroupC()

		const isAllowed = permissionGroup.mayAllow({ "groupC": 0x7 }, "e", "f", "g")

		expect(isAllowed).toBeTruthy()
	})

	it("can generate mask of multiple independent permission", async () => {
		const permissionGroup = new GroupC()

		const mask = permissionGroup.generateMask("e", "f", "g")

		expect(mask).toBe(0x7)
	})
})
