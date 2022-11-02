<template>
	<ul :id="`${header.toLocaleLowerCase()}-flags`" class="flags my-3">
		<h2 class="flag-header">
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
					:disabled="disabled"
					:label="convertToTitle(convertForSentence(permissionName))"
					:value="permissionName"/>
			</li>
		</div>

		<div
			v-if="readScopedPermissionNames.length && writeScopedPermissionNames.length"
			class="access-level-flags">
			<AccessLevelSelector
				v-model="readPermission"
				:disabled="disabled"
				label="Read Access Level"
				:options="readScopedPermissionNames"/>
			<AccessLevelSelector
				v-model="writePermission"
				:disabled="disabled"
				label="Write Access Level"
				:options="writeScopedPermissionNames"/>
		</div>
	</ul>
</template>

<style scoped lang="scss">
@import "@styles/variables.scss";

.flag-header {
	@apply text-size-[1.25rem] mb-3 font-600
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
import makeUnique from "$/array/make_unique"
import subtractArrays from "$/array/subtract"
import BasePermissionGroup from "$/permissions/base"
import sanitizeArray from "$@/helpers/sanitize_array"
import convertToTitle from "$/string/convert_to_title"
import convertForSentence from "$/string/convert_for_sentence"

import Checkbox from "@/fields/checkbox.vue"
import AccessLevelSelector from "@/fields/selectable_options.vue"

// Props should be contained to retain its reactivity
const props = defineProps<{
	header: string
	disabled?: boolean,
	basePermissionGroup: BasePermissionGroup<any, any>
	dependentPermissionGroups?: BasePermissionGroup<any, any>[]
	modelValue: number
}>()

const {
	header,
	basePermissionGroup,
	dependentPermissionGroups = []
} = props

interface CustomEvents {
	(event: "update:modelValue", passedFlag: number): void
	(event: "checkExternalDependencyFlags", infos: ExternalPermissionDependencyInfo<any, any>[])
	: void
	(event: "uncheckExternallyDependentFlags", infos: ExternalPermissionDependencyInfo<any, any>[])
	: void
}
const emit = defineEmits<CustomEvents>()

const rawFlags = computed<string[]>({
	"get": () => basePermissionGroup.deserialize(props.modelValue),
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

			emit(
				"checkExternalDependencyFlags",
				basePermissionGroup.identifyExternalDependencies(resolvedPermissions)
			)
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

		emit("update:modelValue", basePermissionGroup.generateMask(...resolvedPermissions))
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
