import { ref } from "vue"
import type { Permissions } from "$/permissions/post"
import type { FlagSelectorInfo } from "$@/types/component"
import type { DeserializedRoleDocument } from "$/types/documents/role"

import { post, comment } from "$/permissions/permission_list"

import helper from "./make_flag_selector_infos"

describe("Helper: Make flag selector infos", () => {
	it("should check external dependency flags", () => {
		const sourceFlags = comment.name
		const targetFlags = post.name
		const targetPermissions: Permissions[] = [ "view", "create" ]
		const role = ref({
			"data": {
				[targetFlags]: 0
			}
		} as DeserializedRoleDocument)
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

		expect(role.value.data[targetFlags]).toBe(post.generateMask(...targetPermissions))
	})

	it("should uncheck internal dependent flags", () => {
		const sourceFlags = post.name
		const sourcePermissions: Permissions[] = [ "view" ]
		const targetFlags = comment.name
		const role = ref({
			"data": {
				[targetFlags]: comment.generateMask("view")
			}
		} as DeserializedRoleDocument)
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

		expect(role.value.data[targetFlags]).toBe(0)
	})
})
