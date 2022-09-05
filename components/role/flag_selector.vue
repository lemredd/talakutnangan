<!--
	TODO: Refactor all WindiCSS inline classes using @apply directive
 -->
<template>
	<ul :id="`${header.toLocaleLowerCase()}-flags`" class="flags my-3">
		<h2 class="flag-header text-size-[1.25rem] mb-3 font-600">
			{{ header }} Flags
		</h2>

		<div class="operational-flags">
			<span>Operations: </span>
			<li
				v-for="permissionName in operationalPermissionNames"
				:key="permissionName"
				class="ml-5">
				<Checkbox
					v-model="rawFlags"
					:label="convertForSentence(permissionName).toLowerCase()"
					:value="permissionName"/>
			</li>
		</div>

		<div
			v-if="readScopedPermissionNames.length && writeScopedPermissionNames.length"
			class="access-level-flags">
			<AccessLevelSelector
				v-model="readPermission"
				label="Read Access Level"
				:options="readScopedPermissionNames"/>
			<AccessLevelSelector
				v-model="writePermission"
				label="Write Access Level"
				:options="writeScopedPermissionNames"/>
		</div>
	</ul>
</template>

<style scoped lang="scss">
@import "@styles/variables.scss";

.flag-header {
	color: $color-primary;
}

.operational-flags {
	@apply flex flex-col md:flex-row;
}
</style>

<script setup lang="ts">
// Third Parties
import { computed } from "vue"

// Types
import type { OptionInfo } from "$@/types/component"
import type { ExternalPermissionDependencyInfo } from "$/types/permission"

// Developer defined internals
import makeUnique from "$/helpers/array/make_unique"
import BasePermissionGroup from "$/permissions/base"
import subtractArrays from "$/helpers/array/subtract"
import sanitizeArray from "$@/helpers/sanitize_array"
import convertForSentence from "$/string/convert_for_sentence"

import Checkbox from "@/fields/checkbox.vue"
import AccessLevelSelector from "@/fields/selectable_options.vue"

const {
	header,
	basePermissionGroup,
	dependentPermissionGroups = [],
	flags
} = defineProps<{
	header: string
	basePermissionGroup: BasePermissionGroup<any, any>
	dependentPermissionGroups?: BasePermissionGroup<any, any>[]
	flags: number
}>()

interface CustomEvents {
	(event: "update:flags", passedFlag: number): void
	(event: "checkExternalDependencyFlags", infos: ExternalPermissionDependencyInfo<any, any>[])
	: void
	(event: "uncheckExternallyDependentFlags", infos: ExternalPermissionDependencyInfo<any, any>[])
	: void
}
const emit = defineEmits<CustomEvents>()

const rawFlags = computed<string[]>({
	"get": () => basePermissionGroup.deserialize(flags),
	set(newUnresolvedPermissions: string[]) {
		let resolvedPermissions = [ ...newUnresolvedPermissions ]
		const oldFlags = rawFlags.value
		const oldFlagsLength = oldFlags.length
		const newFlagsLength = resolvedPermissions.length
		const hasAddedPermission = oldFlagsLength < newFlagsLength

		if (hasAddedPermission) {
			const newPermissions = subtractArrays(resolvedPermissions, oldFlags)
			resolvedPermissions = makeUnique([
				...resolvedPermissions,
				...basePermissionGroup.identifyDependencies(newPermissions)
			])
		} else {
			const removedPermissions = subtractArrays(oldFlags, resolvedPermissions)
			const dependentPermissions = basePermissionGroup.identifyDependents(removedPermissions)
			resolvedPermissions = subtractArrays(resolvedPermissions, dependentPermissions)

			const allRemovedPermissions = makeUnique([
				...removedPermissions,
				...dependentPermissions
			])

			const externalDependents = dependentPermissionGroups.map(dependentGroup => {
				const externallyDependents = dependentGroup.identifyExternallyDependents([
					{
						"group": basePermissionGroup,
						"permissionDependencies": allRemovedPermissions
					}
				])

				const externalPermissionGroupToAffect: ExternalPermissionDependencyInfo<any, any> = {
					"group": dependentGroup,
					"permissionDependencies": externallyDependents
				}

				return externalPermissionGroupToAffect
			})

			emit("uncheckExternallyDependentFlags", externalDependents)
		}

		emit("update:flags", basePermissionGroup.generateMask(...resolvedPermissions))
		emit(
			"checkExternalDependencyFlags",
			basePermissionGroup.identifyExternalDependencies(resolvedPermissions)
		)
	}
})

const rawEmptyValue = ""
const rawEmptyOption: OptionInfo = {
	"label": "None",
	"value": rawEmptyValue
}

const permissionNames = computed<string[]>(() => Array.from(basePermissionGroup.permissions.keys()))
const operationalPermissionNames = computed<string[]>(() => permissionNames.value.filter(
	permissionName => !permissionName.toLocaleLowerCase().includes("scope")
))
const readScopedPermissionNames = computed<OptionInfo[]>(() => [
	rawEmptyOption,
	...permissionNames.value.filter(permissionName => {
		const name = permissionName.toLocaleLowerCase()
		return name.includes("scope") && name.includes("read")
	}).map(name => ({
		"label": convertForSentence(name),
		"value": name
	}))
])
const writeScopedPermissionNames = computed<OptionInfo[]>(() => [
	rawEmptyOption,
	...permissionNames.value.filter(permissionName => {
		const name = permissionName.toLocaleLowerCase()
		return name.includes("scope") && name.includes("write")
	}).map(name => ({
		"label": convertForSentence(name),
		"value": name
	}))
])

function getScopedPermission(scopedPermissionOptions: OptionInfo[]): string {
	const rawPermissionNames = scopedPermissionOptions.map(option => option.value)
	for (const name of rawPermissionNames) {
		if (rawFlags.value.includes(name)) return name
	}

	return rawEmptyValue
}

function toggleAccessLevel(
	currentPermissions: string[],
	permissionToRemove: string,
	permissionToAdd: string
): void {
	let newPermissions = [ ...currentPermissions ]
	const previousValue = permissionToRemove
	const newValue = permissionToAdd

	if (previousValue !== rawEmptyValue) {
		if (newPermissions.includes(previousValue)) {
			delete newPermissions[newPermissions.indexOf(previousValue)]
			newPermissions = sanitizeArray(newPermissions)
		}
	}

	if (newValue !== rawEmptyValue) {
		newPermissions.push(newValue)
	}

	rawFlags.value = newPermissions
}

const readPermission = computed<string>({
	get(): string {
		return getScopedPermission(readScopedPermissionNames.value)
	},
	set(value: string) {
		toggleAccessLevel(rawFlags.value, readPermission.value, value)
	}
})

const writePermission = computed<string>({
	get(): string {
		return getScopedPermission(writeScopedPermissionNames.value)
	},
	set(value: string) {
		toggleAccessLevel(rawFlags.value, writePermission.value, value)
	}
})
</script>
