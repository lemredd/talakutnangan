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
					:label="transformText.toSentenceCase(permissionName).toLowerCase()"
					:value="permissionName"
					@change="updateFlags"/>
			</li>
		</div>

		<div
			v-if="readScopedPermissionNames.length && writeScopedPermissionNames.length"
			class="access-level-flags">
			<AccessLevelSelector
				:initial-value="initialReadScopedRawFlag"
				label="Read Access Level"
				:options="readScopedPermissionNames"
				@selected-option-changed="updateAccessLevel($event, readScopedPermissionNames)"/>
			<AccessLevelSelector
				:initial-value="initialWriteScopedRawFlag"
				label="Write Access Level"
				:options="writeScopedPermissionNames"
				@selected-option-changed="updateAccessLevel($event, writeScopedPermissionNames)"/>
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
import { computed, ref } from "vue"

// Types
import type { OptionInfo } from "$@/types/component"
import type { ExternalPermissionDependencyInfo } from "$/types/permission"

// Developer defined internals
import BasePermissionGroup from "$/permissions/base"
import makeUnique from "$/helpers/array/make_unique"
import sanitizeArray from "$@/helpers/sanitize_array"
import TextTransformer from "$/helpers/text_transformers"
import includePermissionDependencies from "$@/helpers/include_permission_dependencies"

import Checkbox from "@/fields/checkbox.vue"
import AccessLevelSelector from "@/fields/selectable_options.vue"

const {
	header,
	basePermissionGroup,
	flags
} = defineProps<{
	header: string
	basePermissionGroup: BasePermissionGroup<any, any>
	flags: number
}>()

const rawFlags = computed<string[]>(() => basePermissionGroup.deserialize(flags))

const rawEmptyOption: OptionInfo = {
	"label": "None",
	"value": ""
}

const initialReadScopedRawFlag = computed(() => {
	const scopedRawFlags = rawFlags.value.filter(flag => {
		const name = flag.toLocaleLowerCase()
		return name.includes("scope") && name.includes("read")
	})

	return scopedRawFlags[scopedRawFlags.length - 1]
})
const initialWriteScopedRawFlag = computed(() => {
	const scopedRawFlags = rawFlags.value.filter(flag => {
		const name = flag.toLocaleLowerCase()
		return name.includes("scope") && name.includes("write")
	})

	return scopedRawFlags[scopedRawFlags.length - 1]
})

const permissionNames = Array.from(basePermissionGroup.permissions.keys())
const operationalPermissionNames = permissionNames.filter(
	permissionName => !permissionName.toLocaleLowerCase().includes("scope")
)
const readScopedPermissionNames = permissionNames.filter(permissionName => {
	const name = permissionName.toLocaleLowerCase()
	return name.includes("scope") && name.includes("read")
})
const writeScopedPermissionNames = permissionNames.filter(permissionName => {
	const name = permissionName.toLocaleLowerCase()
	return name.includes("scope") && name.includes("write")
})

interface CustomEvents {
	(event: "update:flags", passedFlag: number): void
	(event: "updateDependencyFlags", infos: ExternalPermissionDependencyInfo<any, any>[]): void
}
const emit = defineEmits<CustomEvents>()

function updateFlags() {
	includePermissionDependencies(basePermissionGroup, rawFlags)

	rawFlags.value = sanitizeArray(makeUnique(rawFlags.value))
	const generatedMask = basePermissionGroup.generateMask(
		...Array.from(rawFlags.value)
	)
	emit("update:flags", generatedMask)
}

function updateAccessLevel(event: Event, accessPermissionNames: string[]) {
	const { value } = event.target as HTMLSelectElement
	rawFlags.value.forEach(rawFlag => {
		if (accessPermissionNames.includes(rawFlag)) {
			delete rawFlags.value[rawFlags.value.indexOf(rawFlag)]
		}
	})
	rawFlags.value.push(value)
	rawFlags.value = sanitizeArray(rawFlags.value)

	const generatedMask = basePermissionGroup.generateMask(
		...Array.from(rawFlags.value)
	)

	emit("update:flags", generatedMask)
}

</script>
