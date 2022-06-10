import type { PermissionMap, PermissionInfo } from "!/types/independent"

import PermissionGroup from "./permission_group"

describe("Back-end: Base Permission Group", () => {
	type GroupNameA = { "groupA": number }
	type AvailablePermissionsA = "a" | "b"

	class GroupA extends PermissionGroup<GroupNameA, AvailablePermissionsA> {
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

	class GroupB extends PermissionGroup<GroupNameB, AvailablePermissionsB> {
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
})
