<!--
	TODO: Refactor all WindiCSS inline classes using @apply directive
 -->
<template>
<ul class="flags my-3">
	<h2 class="flag-header text-size-[1.25rem] mb-3 font-600">{{ header }} Flags</h2>
	<li class="ml-5" v-for="permissionName in permissionNames">
		<Checkbox
			:label="camelToSentence(permissionName).toLowerCase()"
			:value="permissionName"
			@change="updateFlags"
			v-model="rawFlags" />
	</li>
</ul>
</template>

<style scoped lang="scss">
@import "@styles/variables.scss";

.flag-header {
	color: $color-primary;
}
</style>

<script setup lang="ts">
// Third Parties
import { ref } from "vue"
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

function updateFlags() {
	includePermissionDependencies(basePermissionGroup, rawFlags)

	rawFlags.value = uniq(rawFlags.value)
	const generatedMask = basePermissionGroup.generateMask(
		...Array.from(rawFlags.value)
	)
	emit("update:flags", generatedMask)
}

const emit = defineEmits<{
	(e: "update:flags", flags: number): void
}>()

</script>
