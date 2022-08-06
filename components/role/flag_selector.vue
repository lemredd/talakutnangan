<!--
	TODO: Refactor all WindiCSS inline classes using @apply directive
 -->
<template>
<ul class="flags my-3">
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
		<div class="read-scope">
			<label for="read-scope">Read Access Level</label>
			<select name="read-scope" id="read-scope" @change="updateReadAccessLevel">
				<option
					v-for="permissionName in readScopedPermissionNames" :value="permissionName">
						{{ camelToSentence(permissionName).toLocaleLowerCase() }}
				</option>
			</select>
		</div>
		<div class="write-scope">
			<label for="write-scope">Write Access Level</label>
			<select name="write-scope" id="write-scope">
				<option
					v-for="permissionName in writeScopedPermissionNames" :value="permissionName">
						{{ camelToSentence(permissionName).toLocaleLowerCase() }}
				</option>
			</select>
		</div>
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
import { ref, watch } from "vue"
import uniq from "lodash.uniq"

// Developer defined internals
import BasePermissionGroup from "$/permissions/base"
import camelToSentence from "$@/helpers/camel_to_sentence"
import Checkbox from "@/fields/checkbox.vue"
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

	rawFlags.value = uniq(rawFlags.value)
	.filter(Boolean) // Removes falsy values
	const generatedMask = basePermissionGroup.generateMask(
		...Array.from(rawFlags.value)
	)
	emit("update:flags", generatedMask)
}
function updateReadAccessLevel(e: Event) {
	const value = (e.target as HTMLSelectElement).value
	rawFlags.value.map(rawFlag => {
		if (readScopedPermissionNames.includes(rawFlag)) {
			delete rawFlags.value[rawFlags.value.indexOf(rawFlag)]
		}
	})
	rawFlags.value.push(value)
	rawFlags.value = rawFlags.value.filter(Boolean)

	const generatedMask = basePermissionGroup.generateMask(
		...Array.from(rawFlags.value)
	)

	emit("update:flags", generatedMask)
}

watch(rawFlags, () => console.log(rawFlags.value))

const emit = defineEmits<{
	(e: "update:flags", flags: number): void
}>()
</script>
