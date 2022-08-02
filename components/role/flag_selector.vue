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
import { computed, ref } from "vue"
import uniq from "lodash.uniq"

// Types
import type { Permissions as TagPermissions } from "$/permissions/tag"
import type { Permissions as UserPermissions } from "$/permissions/user"
import type { Permissions as PostPermissions } from "$/permissions/post"
import type { Permissions as CommentPermissions } from "$/permissions/comment"
import type { Permissions as SemesterPermissions } from "$/permissions/semester"
import type { Permissions as ProfanityPermissions } from "$/permissions/profanity"
import type { Permissions as AuditTrailPermissions } from "$/permissions/audit_trail"

// Developer defined internals
import BasePermissionGroup from "$/permissions/base"
import camelToSentence from "$@/helpers/camel_to_sentence"
import Checkbox from "@/fields/checkbox.vue"

type Permissions =
	| TagPermissions
	| UserPermissions
	| PostPermissions
	| CommentPermissions
	| SemesterPermissions
	| ProfanityPermissions
	| AuditTrailPermissions

const {
	header,
	basePermissionGroup,
	flags
} = defineProps<{
	header: string
	basePermissionGroup: BasePermissionGroup<any, any>
	flags: number
}>()

const rawFlags = ref(basePermissionGroup.deserialize(flags))
const permissionNames = Array.from(basePermissionGroup.permissions.keys())
function updateFlags() {
	const permissionsWithDependencies = Array.from(rawFlags.value)

	basePermissionGroup.permissions.forEach((info, permissionName) => {
		if (permissionsWithDependencies.includes(permissionName)) {
			info.permissionDependencies.forEach(n => {
				permissionsWithDependencies.push(n)
			})
		}
	})
	rawFlags.value = uniq(permissionsWithDependencies)
	const generatedMask = basePermissionGroup.generateMask(
		...Array.from(permissionsWithDependencies)
	)

	emit("update:flags", generatedMask)
}

const emit = defineEmits<{
	(e: "update:flags", flags: number): void
}>()

</script>
