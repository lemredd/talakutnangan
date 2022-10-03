import { ref } from "vue"
import type { Permissions } from "$/permissions/post"
import type { FlagSelectorInfo } from "$@/types/component"
import type { RoleAttributes } from "$/types/documents/role"

import { post, comment } from "$/permissions/permission_list"

import helper from "./make_flag_selector_infos"

describe("Helper: Make flag selector infos", () => {
	it("should check external dependency flags", () => {
		const sourceFlags = comment.name
		const targetFlags = post.name
		const targetPermissions: Permissions[] = [ "view", "create" ]
		const role = ref({
			[targetFlags]: 0
		} as RoleAttributes<"deserialized">)
		const infos = helper(role)
		const targetInfo = infos.find(
			info => info.permissionGroup.name === sourceFlags
		) as FlagSelectorInfo

		targetInfo.checkExternal([
			{
				"group": post,
				"permissionDependencies": targetPermissions
			}
		])

		expect(role.value[targetFlags]).toBe(post.generateMask(...targetPermissions))
	})

	it("should uncheck internal dependent flags", () => {
		const sourceFlags = post.name
		const sourcePermissions: Permissions[] = [ "view" ]
		const targetFlags = comment.name
		const role = ref({
			[targetFlags]: comment.generateMask("view")
		} as RoleAttributes<"deserialized">)
		const infos = helper(role)
		const targetInfo = infos.find(
			info => info.permissionGroup.name === sourceFlags
		) as FlagSelectorInfo

		targetInfo.uncheckExternal([
			{
				"group": post,
				"permissionDependencies": sourcePermissions
			}
		])

		expect(role.value[targetFlags]).toBe(0)
	})
})
