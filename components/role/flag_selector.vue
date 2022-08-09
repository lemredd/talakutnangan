<!--
	TODO: Refactor all WindiCSS inline classes using @apply directive
 -->
<template>
<ul class="flags my-3" :id="`${header.toLocaleLowerCase()}-flags`">
	<h2 class="flag-header text-size-[1.25rem] mb-3 font-600">{{ header }} Flags</h2>

	<div class="operational-flags">
		<span>Operations: </span>
		<li class="ml-5" v-for="permissionName in operationalPermissionNames">
			<Checkbox
				:label="camelToSentence(permissionName).toLowerCase()"
				:value="permissionName"
				@change="updateFlags"
				v-model="rawFlags" />
		</li>
	</div>

	<div class="access-level-flags" v-if="readScopedPermissionNames.length && writeScopedPermissionNames.length">
		<AccessLevelSelector
			label="Read Access Level" :options="readScopedPermissionNames" @selected-option-changed="updateAccessLevel($event, readScopedPermissionNames)" />
		<AccessLevelSelector
			label="Write Access Level" :options="writeScopedPermissionNames" @selected-option-changed="updateAccessLevel($event, writeScopedPermissionNames)" />
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
import { ref } from "vue"
import uniq from "lodash.uniq"

// Developer defined internals
import Checkbox from "@/fields/checkbox.vue"
import AccessLevelSelector from "@/fields/dropdown_select.vue"
import BasePermissionGroup from "$/permissions/base"
import camelToSentence from "$@/helpers/camel_to_sentence"
import sanitizeArray from "$@/helpers/sanitize_array"
import includePermissionDependencies from "$@/helpers/include_permission_dependencies"

const {
	header,
	basePermissionGroup,
	flags
} = defineProps<{
	header: string
	basePermissionGroup: BasePermissionGroup<any, any>
	flags: number
}>()

const rawFlags = ref<string[]>(basePermissionGroup.deserialize(flags))
const permissionNames = Array.from(basePermissionGroup.permissions.keys())
const operationalPermissionNames = permissionNames.filter((permissionName) => {
	return !permissionName.toLocaleLowerCase().includes("scope")
})
const readScopedPermissionNames = permissionNames.filter((permissionName) => {
	const name = permissionName.toLocaleLowerCase()
	return name.includes("scope") && name.includes("read")
})
const writeScopedPermissionNames = permissionNames.filter((permissionName) => {
	const name = permissionName.toLocaleLowerCase()
	return name.includes("scope") && name.includes("write")
})

function updateFlags() {
	includePermissionDependencies(basePermissionGroup, rawFlags)

	rawFlags.value = sanitizeArray(uniq(rawFlags.value))
	const generatedMask = basePermissionGroup.generateMask(
		...Array.from(rawFlags.value)
	)
	emit("update:flags", generatedMask)
}

function updateAccessLevel(e: Event, accessPermissionNames: string[]) {
	const value = (e.target as HTMLSelectElement).value
	rawFlags.value.map(rawFlag => {
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

const emit = defineEmits<{
	(e: "update:flags", flags: number): void
}>()
</script>
