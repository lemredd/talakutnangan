<template>
<div class="post-flags">
			<h2>Post Flags</h2>
			<Checkbox v-for="permissionName in permissionNames"
				:label="camelToSentence(permissionName).toLowerCase()"
				:value="permissionName"
				@change="updateFlags"
				v-model="rawFlags" />
		</div>
</template>

<style>
</style>

<script setup lang="ts">
// Third Parties
import { computed, ref } from "vue"

// Types
import type { Permissions as TagPermissions } from "$/permissions/tag_permissions"
import type { Permissions as UserPermissions } from "$/permissions/user_permissions"
import type { Permissions as PostPermissions } from "$/permissions/post_permissions"
import type { Permissions as CommentPermissions } from "$/permissions/comment_permissions"
import type { Permissions as SemesterPermissions } from "$/permissions/semester_permissions"
import type { Permissions as ProfanityPermissions } from "$/permissions/profanity_permissions"
import type { Permissions as AuditTrailPermissions } from "$/permissions/audit_trail_permissions"

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
	basePermissionGroup,
	flags
} = defineProps<{
	basePermissionGroup: BasePermissionGroup<any, any>
	flags: number
}>()

const rawFlags = ref(new Set(basePermissionGroup.deserialize(flags)))
const permissionNames = Array.from(basePermissionGroup.permissions.keys())
function updateFlags() {
	console.log("Updating flags...")
	const permissionsWithDependencies = new Set([...rawFlags.value])

	basePermissionGroup.permissions.forEach((info, permissionName) => {
		if (permissionsWithDependencies.has(permissionName)) {
			info.permissionDependencies.forEach(n => {
				permissionsWithDependencies.add(n)
			})
		}
	})
	console.log(basePermissionGroup.generateMask(...permissionsWithDependencies))
	rawFlags.value = permissionsWithDependencies
	emit("update:flags", basePermissionGroup.generateMask(...permissionsWithDependencies))
}

const emit = defineEmits<{
	(e: "update:flags", flags: number): void
}>()

</script>
