import { computed, Ref } from "vue"

import type { FlagSelectorInfo } from "$@/types/component"
import type { DeserializedRoleDocument } from "$/types/documents/role"
import type { ExternalPermissionDependencyInfo } from "$/types/permission"

import makeUnique from "$/array/make_unique"
import PermissionGroup from "$/permissions/base"
import {
	semester as semesterPermissions,
	tag as tagPermissions,
	post as postPermissions,
	comment as commentPermissions,
	profanity as profanityPermissions,
	user as userPermissions,
	auditTrail as auditTrailPermissions
} from "$/permissions/permission_list"

export default function(role: Ref<DeserializedRoleDocument<"read">>) {
	function checkExternalDependencies(dependencies: ExternalPermissionDependencyInfo<any, any>[])
	: void {
		for (const dependency of dependencies) {
			const {
				group,
				permissionDependencies
			} = dependency

			const flagsToAdd = group.generateMask(...permissionDependencies)

			const newFlags = role.value.data[group.name] | flagsToAdd
			role.value.data[group.name] = newFlags

			const externalDependencies = group.identifyExternalDependencies(permissionDependencies)
			checkExternalDependencies(externalDependencies)
		}
	}

	function uncheckExternalDependents(dependents: ExternalPermissionDependencyInfo<any, any>[])
	: void {
		if (dependents.length === 0) return

		let externalDependencyNames: string[] = []
		const dependentNames: string[] = []

		for (const dependent of dependents) {
			const {
				group,
				permissionDependencies
			} = dependent

			const internalDependents = group.identifyDependents(permissionDependencies)
			const allDependents = makeUnique([
				...permissionDependencies,
				...internalDependents
			])
			const flagsToRemove = group.generateMask(...allDependents)

			// eslint-disable-next-line no-bitwise
			const filteredFlags = role.value.data[group.name] & ~flagsToRemove
			role.value.data[group.name] = filteredFlags

			dependentNames.push(group.name)
			const externalDependencies = group.identifyExternalDependencies(permissionDependencies)

			for (const dependency of externalDependencies) {
				externalDependencyNames.push(dependency.group.name)
			}
		}

		externalDependencyNames = makeUnique(externalDependencyNames)
		const unsuspectedNames = makeUnique([ ...externalDependencyNames, ...dependentNames ])

		const possibleDependents = [
			semesterPermissions,
			tagPermissions,
			postPermissions,
			commentPermissions,
			profanityPermissions,
			userPermissions,
			auditTrailPermissions
		].filter(info => !unsuspectedNames.includes(info.name))

		const subdependents = possibleDependents
		.map(subdependent => {
			const permissionDependencies = subdependent.identifyExternallyDependents(dependents)

			return {
				"group": subdependent,
				permissionDependencies
			}
		})
		.filter(subdependentInfo => subdependentInfo.permissionDependencies.length > 0)

		uncheckExternalDependents(subdependents)
	}

	function makeFlagSelectorInfo(
		header: string,
		permissionGroup: PermissionGroup<any, any>,
		{
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			uncheckExternal = () => {},
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			checkExternal = () => {},
			dependentGroups = []
		}: Partial<{
			"dependentGroups": PermissionGroup<any, any>[]
			"uncheckExternal": (dependencies: ExternalPermissionDependencyInfo<any, any>[]) => void,
			"checkExternal": (dependencies: ExternalPermissionDependencyInfo<any, any>[]) => void
		}> = {}
	): FlagSelectorInfo {
		return {
			checkExternal,
			dependentGroups,
			header,
			"model": computed<number>({
				get(): number { return role.value.data[permissionGroup.name] },
				set(newValue: number): void { role.value.data[permissionGroup.name] = newValue }
			}),
			permissionGroup,
			uncheckExternal
		}
	}

	const flagSelectors: FlagSelectorInfo[] = [
		makeFlagSelectorInfo("Semester", semesterPermissions),
		makeFlagSelectorInfo("Tag", tagPermissions),
		makeFlagSelectorInfo("Post", postPermissions, {
			"dependentGroups": [ commentPermissions ],
			"uncheckExternal": uncheckExternalDependents
		}),
		makeFlagSelectorInfo("Comment", commentPermissions, {
			"checkExternal": checkExternalDependencies
		}),
		makeFlagSelectorInfo("Profanity", profanityPermissions),
		makeFlagSelectorInfo("User", userPermissions),
		makeFlagSelectorInfo("Audit Trail", auditTrailPermissions)
	]

	return flagSelectors
}
