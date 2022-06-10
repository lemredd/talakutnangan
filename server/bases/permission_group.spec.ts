import type { PermissionMap } from "!/types/independent"

import PermissionGroup from "./permission_group"

describe("Back-end: Base Permission Group", () => {
	it("cannot evaluate without required name in role", async () => {
		type AvailablePermissions = "" | ""

		class PermissionGroupA extends PermissionGroup<AvailablePermissions> {
			get name(): string { return "groupA" }

			get permissions(): PermissionMap<AvailablePermissions> {
				return new Map()
			}
		}
		const permissionGroup = new PermissionGroupA()

		expect(() => permissionGroup.mayAllow({}, "")).toThrowError()
	})

	it.todo("can check simple permission")
	it.todo("can check dependent permission")
})
