import { Ref } from "vue"
import BasePermissionGroup from "$/permissions/base"

export default function includePermissionDependencies(
	basePermissionGroup: BasePermissionGroup<any, any>,
	rawFlags: Ref<string[]>) {
	basePermissionGroup.permissions.forEach((info, name) => {
		if (rawFlags.value.includes(name)) {
			info.permissionDependencies.forEach(flagDep => {
				rawFlags.value.push(flagDep)
			})
		}
	})
}
